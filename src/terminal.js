/**
 * TERMINUS — terminal.js
 * Embeddable terminal component. Vanilla JS, no dependencies.
 * v2.0.0
 */

class TerminalComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      theme: 'dark',
      prompt: 'gnu$',
      titlebar: 'mac',
      commands: {},
      onTab: null,
      notFound: "Comando no encontrado: {cmd}. Escribe 'help' para ver comandos disponibles.",
      ...this.parseDataAttributes(),
      ...options
    };

    this.history = [];
    this.historyIndex = 0;
    this._modeHandler = null;
    this._modeKeyHandler = null;

    this.init();
  }

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

    if (this.element.dataset.titlebar) {
      data.titlebar = this.element.dataset.titlebar;
    }

    if (this.element.dataset.notFound) {
      data.notFound = this.element.dataset.notFound;
    }

    return data;
  }

  init() {
    this.element.classList.add('gnu-terminal');
    this.render();
    this.setupEventListeners();
    this.applyTheme();
    this.showWelcomeMessage();
    // Auto-focus only if data-autofocus attribute is present
    if (this.element.hasAttribute('data-autofocus')) {
      setTimeout(() => {
        this.inputElement.focus();
      }, 100);
    }
  }

  render() {
    this.element.setAttribute('tabindex', '0');
    // data-titlebar="custom": preserve existing titlebar HTML written by the user
    const customTitlebar = this.options.titlebar === 'custom'
      ? this.element.querySelector('.titlebar')?.outerHTML || ''
      : '';
    const titlebarHTML = this.options.titlebar === 'none' || this.options.titlebar === 'custom'
      ? customTitlebar
      : this.options.titlebar === 'windows'
        ? `<div class="titlebar">
        <span class="win-btn win-min">&#8722;</span>
        <span class="win-btn win-max">&#9633;</span>
        <span class="win-btn win-close">&#10005;</span>
      </div>`
        : `<div class="titlebar">
        <span class="dot"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>`;
    this.element.innerHTML = `${titlebarHTML}
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

  setupEventListeners() {
    this.inputElement.addEventListener('keydown', (e) => {
      // Prevent bubbling to document — avoids triggering _modeKeyHandler
      // with the same event that caused enterMode() to be called
      e.stopPropagation();
      // Ctrl+C — cancels input in normal mode
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
        const outRect = this.outputElement.getBoundingClientRect();
        const lines = Array.from(this.outputElement.querySelectorAll('.output-line'));
        let row = lines.findIndex(l => l.contains(e.target) || l === e.target);
        if (row === -1) {
          // Fallback: calculate from pixel position relative to output element
          row = Math.floor((e.clientY - outRect.top) / this._lineHeight());
        }
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
   * Processes a command.
   * Supports handlers as string (original behavior) or
   * as function (args, terminal) => string|void  [v2.0]
   */
  processCommand(command) {
    if (!command) return;

    this.addToHistory(command);
    this.addToOutput(`${this.options.prompt} ${command}`);

    // Built-in command: clear
    if (command === 'clear') {
      this.clear();
      return;
    }

    // Parse verb + arguments
    const parts = command.trim().split(/\s+/);
    const verb  = parts[0];
    const args  = parts.slice(1);

    // Look up by verb first; if not found, try full command key (backward compat)
    const handler = this.options.commands[verb] !== undefined
      ? this.options.commands[verb]
      : this.options.commands[command];

    if (handler !== undefined) {
      if (typeof handler === 'function') {
        const result = handler(args, this);
        if (typeof result === 'string') result.split('\n').forEach(l => this.addToOutput(l));
      } else {
        handler.split('\n').forEach(l => this.addToOutput(l));
      }
    } else {
      this.addToOutput(this.options.notFound.replace('{cmd}', verb));
    }
  }

  addToHistory(command) {
    this.history.push(command);
    this.historyIndex = this.history.length;
  }

  navigateHistory(direction) {
    const newIndex = this.historyIndex + direction;
    
    if (newIndex >= 0 && newIndex <= this.history.length) {
      this.historyIndex = newIndex;
      this.inputElement.value = this.history[this.historyIndex] || '';
    }
  }

  /**
   * Adds plain text output to the terminal (safe)
   */
  addToOutput(content) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = content;
    this.outputElement.appendChild(line);
    this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
  }

  /**
   * Adds HTML output to the terminal [v2.0]
   * The developer is responsible for sanitizing user-provided content.
   */
  addOutputHTML(html) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.innerHTML = html;
    this.outputElement.appendChild(line);
    this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
  }

  clear() {
    this.outputElement.innerHTML = '';
  }

  /**
   * Shows the welcome message if configured
   */
  showWelcomeMessage() {
    const welcomeMessage = this.element.dataset.welcome;
    if (welcomeMessage) {
      // Split by lines and add each one
      const lines = welcomeMessage.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          this.addToOutput(line);
        } else {
          // Empty line
          const emptyLine = document.createElement('div');
          emptyLine.className = 'output-line';
          emptyLine.innerHTML = '&nbsp;';
          this.outputElement.appendChild(emptyLine);
        }
      });
    }
  }

  applyTheme() {
    this.element.setAttribute('data-theme', this.options.theme);
    this.element.setAttribute('data-titlebar', this.options.titlebar);
  }

  applyTitlebar() {
    this.element.setAttribute('data-titlebar', this.options.titlebar);
    if (this.options.titlebar === 'custom') return;

    const newHTML = this.options.titlebar === 'none'
      ? ''
      : this.options.titlebar === 'windows'
        ? `<div class="titlebar"><span class="win-btn win-min">&#8722;</span><span class="win-btn win-max">&#9633;</span><span class="win-btn win-close">&#10005;</span></div>`
        : `<div class="titlebar"><span class="dot"></span><span class="dot yellow"></span><span class="dot green"></span></div>`;

    const existing = this.element.querySelector('.titlebar');
    if (existing) {
      if (newHTML) existing.insertAdjacentHTML('afterend', newHTML);
      existing.remove();
    } else if (newHTML) {
      this.element.insertAdjacentHTML('afterbegin', newHTML);
    }
  }

  setPrompt(prompt) {
    this.options.prompt = prompt;
    this.promptElement.textContent = prompt;
  }

  setCommands(commands) {
    this.options.commands = { ...this.options.commands, ...commands };
  }

  // --- enterMode / exitMode  [v2.0] ---

  /**
   * Activates TUI mode. Hides the input and redirects keyboard + click to the handler.
   * handler: { onKey(key, event, terminal), onClick(x, y, row, col, terminal), onCtrlC(terminal) }
   */
  enterMode(handler) {
    this._modeHandler = handler;
    const inputLine = this.element.querySelector('.input-line');
    if (inputLine) inputLine.style.display = 'none';

    this._modeKeyHandler = (e) => {
      if (!this._modeHandler) return;
      // Only process if this terminal is active (has or is the focus)
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
   * Exits TUI mode and restores normal terminal.
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

  // --- play(script)  [v2.0] ---

  /**
   * Runs an animated demo script.
   * Step types: 'cmd' | 'output' | 'outputHTML' | 'clear' | 'pause'
   * Each step accepts { type, text, html, delay }
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
          // delay already applied above
          break;
      }
    }
  }

  /**
   * Animates command typing in the output (not in the real input).
   * Hides the input-line during animation to avoid duplicates.
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
   * Executes a command without echoing prompt+cmd (internal use by play).
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
        if (typeof result === 'string') result.split('\n').forEach(l => this.addToOutput(l));
      } else {
        handler.split('\n').forEach(l => this.addToOutput(l));
      }
    }
  }

  // --- Tab autocomplete  [v2.0] ---

  /**
   * Tab autocomplete. Uses options.onTab if defined;
   * otherwise completes from registered command names.
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

  // --- readline(promptText)  [v2.0] ---

  /**
   * Prompts the user for inline input. Returns a Promise with the value.
   * Example: const name = await t.readline('Name: ');
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
      // Capture phase: intercepts before the normal Enter listener
      this.inputElement.addEventListener('keydown', onEnter, true);
    });
  }

  // --- rows / cols  [v2.0] ---

  /**
   * Approximate number of visible rows in the viewport.
   */
  get rows() {
    const vp = this.element.querySelector('.viewport');
    if (!vp) return 24;
    return Math.max(1, Math.floor((vp.clientHeight - 32) / this._lineHeight()));
  }

  /**
   * Approximate number of character columns in the viewport.
   */
  get cols() {
    const vp = this.element.querySelector('.viewport');
    if (!vp) return 80;
    return Math.max(1, Math.floor((vp.clientWidth - 32) / this._charWidth()));
  }

  /**
   * Line height in px (internal use).
   */
  _lineHeight() {
    const vp = this.element.querySelector('.viewport');
    return parseFloat(vp ? getComputedStyle(vp).lineHeight : '22') || 22;
  }

  /**
   * Width of a monospace character in px (internal use).
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
 * Auto-initialization
 * Finds elements with class 'gnu-terminal' and initializes them automatically
 */
function initTerminals() {
  // Initialize global instances array if it doesn't exist
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

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTerminals);
} else {
  initTerminals();
}

// Export for manual use
window.TerminalComponent = TerminalComponent;