/**
 * TERMINUS — terminal.js
 * Componente terminal embebible. Vanilla JS, sin dependencias.
 * v2.0.0
 */

class TerminalComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      theme: 'dark',
      prompt: 'gnu$',
      commands: {},
      onTab: null,
      ...this.parseDataAttributes(),
      ...options
    };

    this.history = [];
    this.historyIndex = 0;
    this.isTyping = false;
    this._modeHandler = null;
    this._modeKeyHandler = null;

    this.init();
  }

  /**
   * Parsea los data-attributes del elemento
   */
  parseDataAttributes() {
    const data = {};
    
    if (this.element.dataset.theme) {
      data.theme = this.element.dataset.theme;
    }
    
    if (this.element.dataset.prompt) {
      data.prompt = this.element.dataset.prompt;
    }
    
    if (this.element.dataset.commands) {
      try {
        data.commands = JSON.parse(this.element.dataset.commands);
      } catch (e) {
        console.warn('Invalid JSON in data-commands:', e);
        data.commands = {};
      }
    }
    
    return data;
  }

  /**
   * Inicializa el terminal
   */
  init() {
    this.element.classList.add('gnu-terminal');
    this.render();
    this.setupEventListeners();
    this.applyTheme();
    this.showWelcomeMessage();
    // Auto-enfoque solo si el atributo data-autofocus está presente
    if (this.element.hasAttribute('data-autofocus')) {
      setTimeout(() => {
        this.inputElement.focus();
      }, 100);
    }
  }

  /**
   * Renderiza la estructura del terminal
   */
  render() {
    this.element.setAttribute('tabindex', '0');
    this.element.innerHTML = `
      <div class="titlebar">
        <span class="dot"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="viewport">
        <div class="output"></div>
        <div class="input-line">
          <span class="prompt">${this.options.prompt}</span>
          <input type="text" class="terminal-input" autocomplete="off" spellcheck="false">
        </div>
      </div>
    `;

    this.outputElement = this.element.querySelector('.output');
    this.viewportElement = this.element.querySelector('.viewport');
    this.inputElement = this.element.querySelector('.terminal-input');
    this.promptElement = this.element.querySelector('.prompt');
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    this.inputElement.addEventListener('keydown', (e) => {
      // Prevent bubbling to document — avoids triggering _modeKeyHandler
      // with the same event that caused enterMode() to be called
      e.stopPropagation();
      // Ctrl+C — cancela input en modo normal
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        this.addToOutput(`${this.options.prompt} ${this.inputElement.value}^C`);
        this.inputElement.value = '';
        return;
      }
      // Tab — autocomplete
      if (e.key === 'Tab') {
        e.preventDefault();
        this._handleTab();
        return;
      }
      if (e.key === 'Enter') {
        this.processCommand(this.inputElement.value.trim());
        this.inputElement.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      }
    });

    this.element.addEventListener('click', (e) => {
      if (this._modeHandler && this._modeHandler.onClick) {
        // Find the row by matching the clicked element to an output-line index
        const lines = Array.from(this.outputElement.querySelectorAll('.output-line'));
        let row = lines.findIndex(l => l.contains(e.target) || l === e.target);
        if (row === -1) {
          // Fallback: calculate from pixel position relative to output element
          const outRect = this.outputElement.getBoundingClientRect();
          const lh = this._lineHeight();
          row = Math.floor((e.clientY - outRect.top) / lh);
        }
        const outRect = this.outputElement.getBoundingClientRect();
        const cw = this._charWidth();
        const x = e.clientX - outRect.left;
        const y = e.clientY - outRect.top;
        this._modeHandler.onClick(x, y, row, Math.floor(x / cw), this);
        return;
      }
      this.inputElement.focus();
    });
  }

  /**
   * Procesa un comando.
   * Soporta handlers como string (comportamiento original) o
   * como función (args, terminal) => string|void  [NUEVO v2.0]
   */
  processCommand(command) {
    if (!command) return;

    this.addToHistory(command);
    this.addToOutput(`${this.options.prompt} ${command}`);

    // Comando integrado: clear
    if (command === 'clear') {
      this.clear();
      return;
    }

    // Parsear verbo + argumentos
    const parts = command.trim().split(/\s+/);
    const verb  = parts[0];
    const args  = parts.slice(1);

    // Buscar por verbo primero; si no existe, buscar clave completa (backward compat)
    const handler = this.options.commands[verb] !== undefined
      ? this.options.commands[verb]
      : this.options.commands[command];

    if (handler !== undefined) {
      if (typeof handler === 'function') {
        const result = handler(args, this);
        if (typeof result === 'string') this.addToOutput(result);
      } else {
        this.addToOutput(handler);
      }
    } else {
      this.addToOutput(`Comando no encontrado: ${verb}. Escribe 'help' para ver comandos disponibles.`);
    }
  }

  /**
   * Añade comando al historial
   */
  addToHistory(command) {
    this.history.push(command);
    this.historyIndex = this.history.length;
  }

  /**
   * Navega por el historial
   */
  navigateHistory(direction) {
    const newIndex = this.historyIndex + direction;
    
    if (newIndex >= 0 && newIndex <= this.history.length) {
      this.historyIndex = newIndex;
      this.inputElement.value = this.history[this.historyIndex] || '';
    }
  }

  /**
   * Añade salida al terminal (texto plano, seguro)
   */
  addToOutput(content) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = content;
    this.outputElement.appendChild(line);
    this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
  }

  /**
   * Añade salida HTML al terminal [NUEVO v2.0]
   * El desarrollador es responsable de sanear contenido procedente del usuario.
   */
  addOutputHTML(html) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.innerHTML = html;
    this.outputElement.appendChild(line);
    this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
  }

  /**
   * Limpia el terminal
   */
  clear() {
    this.outputElement.innerHTML = '';
  }

  /**
   * Muestra mensaje de bienvenida si está configurado
   */
  showWelcomeMessage() {
    const welcomeMessage = this.element.dataset.welcome;
    if (welcomeMessage) {
      // Dividir por líneas y agregar cada una
      const lines = welcomeMessage.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          this.addToOutput(line);
        } else {
          // Línea vacía
          const emptyLine = document.createElement('div');
          emptyLine.className = 'output-line';
          emptyLine.innerHTML = '&nbsp;';
          this.outputElement.appendChild(emptyLine);
        }
      });
    }
  }

  /**
   * Aplica el tema
   */
  applyTheme() {
    // Remover temas existentes
    this.element.removeAttribute('data-theme');
    
    // Aplicar nuevo tema
    this.element.setAttribute('data-theme', this.options.theme);
    
    // Forzar re-renderizado
    this.element.offsetHeight;
  }

  /**
   * Actualiza el prompt
   */
  setPrompt(prompt) {
    this.options.prompt = prompt;
    this.promptElement.textContent = prompt;
  }

  /**
   * Actualiza los comandos
   */
  setCommands(commands) {
    this.options.commands = { ...this.options.commands, ...commands };
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIMITIVO 3: enterMode / exitMode  [NUEVO v2.0]
  // ─────────────────────────────────────────────────────────────────

  /**
   * Activa modo TUI. Oculta el input y redirige teclado + click al handler.
   * handler: { onKey(key, event, terminal), onClick(x, y, row, col, terminal), onCtrlC(terminal) }
   */
  enterMode(handler) {
    this._modeHandler = handler;
    const inputLine = this.element.querySelector('.input-line');
    if (inputLine) inputLine.style.display = 'none';

    this._modeKeyHandler = (e) => {
      if (!this._modeHandler) return;
      // Solo procesar si este terminal está activo (tiene o es el foco)
      if (!this.element.contains(document.activeElement) && document.activeElement !== this.element) return;
      // Prevent page scroll for navigation keys
      const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', ' '];
      if (navKeys.includes(e.key)) e.preventDefault();
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        if (this._modeHandler.onCtrlC) this._modeHandler.onCtrlC(this);
        else this.exitMode();
        return;
      }
      if (this._modeHandler.onKey) {
        this._modeHandler.onKey(e.key, e, this);
      }
    };
    document.addEventListener('keydown', this._modeKeyHandler);
    this.element.focus();
  }

  /**
   * Sale del modo TUI y restaura el terminal normal.
   */
  exitMode() {
    if (this._modeKeyHandler) {
      document.removeEventListener('keydown', this._modeKeyHandler);
      this._modeKeyHandler = null;
    }
    this._modeHandler = null;
    const inputLine = this.element.querySelector('.input-line');
    if (inputLine) inputLine.style.display = '';
    this.inputElement.focus();
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIMITIVO 4: play(script)  [NUEVO v2.0]
  // ─────────────────────────────────────────────────────────────────

  /**
   * Ejecuta un script de demo con animación de escritura.
   * Tipos de paso: 'cmd' | 'output' | 'outputHTML' | 'clear' | 'pause'
   * Cada paso acepta { type, text, html, delay }
   */
  async play(script) {
    for (const step of script) {
      if (step.delay) await new Promise(r => setTimeout(r, step.delay));
      switch (step.type) {
        case 'cmd':
          await this._typeInput(step.text || '');
          await this._execSilent(step.text || '');
          break;
        case 'output':
          this.addToOutput(step.text || '');
          break;
        case 'outputHTML':
          this.addOutputHTML(step.html || step.text || '');
          break;
        case 'progress': {
          const total    = step.steps    || 20;
          const ch       = step.char     || '=';
          const label    = step.text     || '';
          const stepMs   = step.stepDelay || 80;
          const line = document.createElement('div');
          line.className = 'output-line';
          this.outputElement.appendChild(line);
          for (let i = 0; i <= total; i++) {
            const filled = ch.repeat(i);
            const empty  = ' '.repeat(total - i);
            const head   = i < total ? '>' : '';
            line.textContent = label + ' [' + filled + head + empty + '] ' + Math.round((i / total) * 100) + '%';
            this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
            if (i < total) await new Promise(r => setTimeout(r, stepMs));
          }
          break;
        }
        case 'clear':
          this.clear();
          break;
        case 'pause':
          // delay ya aplicado arriba
          break;
      }
    }
  }

  /**
   * Anima la escritura del comando en el output (no en el input real).
   * Oculta el input-line durante la animación para evitar duplicados.
   */
  async _typeInput(text) {
    const inputLine = this.element.querySelector('.input-line');
    if (inputLine) inputLine.style.visibility = 'hidden';

    const line = document.createElement('div');
    line.className = 'output-line';
    this.outputElement.appendChild(line);

    const prefix = this.options.prompt + ' ';
    for (let i = 0; i <= text.length; i++) {
      line.textContent = prefix + text.slice(0, i);
      this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
      if (i < text.length) await new Promise(r => setTimeout(r, 35 + Math.random() * 45));
    }
    await new Promise(r => setTimeout(r, 180));

    if (inputLine) inputLine.style.visibility = '';
  }

  /**
   * Ejecuta un comando sin imprimir el echo prompt+cmd (uso interno de play).
   */
  _execSilent(cmd) {
    if (!cmd) return;
    this.addToHistory(cmd);
    if (cmd === 'clear') { this.clear(); return; }
    const parts   = cmd.trim().split(/\s+/);
    const verb    = parts[0];
    const args    = parts.slice(1);
    const handler = this.options.commands[verb] !== undefined
      ? this.options.commands[verb]
      : this.options.commands[cmd];
    if (handler !== undefined) {
      if (typeof handler === 'function') {
        const result = handler(args, this);
        if (typeof result === 'string') this.addToOutput(result);
      } else {
        this.addToOutput(handler);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIMITIVO 5: Tab autocomplete  [NUEVO v2.0]
  // ─────────────────────────────────────────────────────────────────

  /**
   * Autocomplete por Tab. Usa options.onTab si está definido;
   * si no, completa desde los nombres de comandos registrados.
   */
  _handleTab() {
    const val = this.inputElement.value;
    if (!val) return;
    if (this.options.onTab) {
      this.options.onTab(val, this);
      return;
    }
    // Default: complete single-word command names only (skip multi-word keys like "cd foo/")
    const candidates = ['clear', ...Object.keys(this.options.commands).filter(k => !/\s/.test(k))];
    const match = candidates.find(k => k.startsWith(val) && k !== val);
    if (match) this.inputElement.value = match;
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIMITIVO 6: readline(promptText)  [NUEVO v2.0]
  // ─────────────────────────────────────────────────────────────────

  /**
   * Pide un dato inline al usuario. Devuelve una Promise con el valor.
   * Ejemplo: const name = await t.readline('Nombre: ');
   */
  readline(promptText) {
    return new Promise(resolve => {
      this.addToOutput(promptText);
      this.promptElement.textContent = '>';
      this.inputElement.value = '';
      this.inputElement.focus();
      const onEnter = (e) => {
        if (e.key === 'Enter') {
          e.stopImmediatePropagation();
          const val = this.inputElement.value;
          this.addToOutput('> ' + val);
          this.inputElement.value = '';
          this.inputElement.removeEventListener('keydown', onEnter, true);
          // Restore prompt after the awaiting code has had a chance to run
          Promise.resolve().then(() => {
            this.promptElement.textContent = this.options.prompt;
          });
          resolve(val);
        }
      };
      // Fase de captura: intercepta antes que el listener normal de Enter
      this.inputElement.addEventListener('keydown', onEnter, true);
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIMITIVO 7: rows / cols  [NUEVO v2.0]
  // ─────────────────────────────────────────────────────────────────

  /**
   * Número aproximado de filas visibles en el viewport.
   */
  get rows() {
    const vp = this.element.querySelector('.viewport');
    if (!vp) return 24;
    return Math.max(1, Math.floor((vp.clientHeight - 32) / this._lineHeight()));
  }

  /**
   * Número aproximado de columnas de caracteres en el viewport.
   */
  get cols() {
    const vp = this.element.querySelector('.viewport');
    if (!vp) return 80;
    return Math.max(1, Math.floor((vp.clientWidth - 32) / this._charWidth()));
  }

  /**
   * Altura de línea en px (uso interno).
   */
  _lineHeight() {
    const vp = this.element.querySelector('.viewport');
    return parseFloat(vp ? getComputedStyle(vp).lineHeight : '22') || 22;
  }

  /**
   * Ancho de un carácter monospace en px (uso interno).
   */
  _charWidth() {
    const span = document.createElement('span');
    span.style.cssText = 'visibility:hidden;position:absolute;white-space:pre;font-family:inherit;font-size:inherit';
    span.textContent = 'M';
    this.outputElement.appendChild(span);
    const w = span.offsetWidth || 8;
    this.outputElement.removeChild(span);
    return w;
  }
}

/**
 * Auto-inicialización
 * Busca elementos con clase 'gnu-terminal' y los inicializa automáticamente
 */
function initTerminals() {
  // Inicializar array global de instancias si no existe
  if (!window.terminalInstances) {
    window.terminalInstances = [];
  }

  document.querySelectorAll('.gnu-terminal').forEach(element => {
    if (!element.terminalComponent) {
      const instance = new TerminalComponent(element);
      element.terminalComponent = instance;
      window.terminalInstances.push(instance);
    }
  });
}

// Auto-init cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTerminals);
} else {
  initTerminals();
}

// Exportar para uso manual
window.TerminalComponent = TerminalComponent;