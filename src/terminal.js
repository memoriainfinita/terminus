/**
 * TERMINUS - Terminal Component
 * Componente principal del terminal embebible GNU
 * Versión: 1.0.0
 */

class TerminalComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      theme: 'dark',
      prompt: 'gnu$',
      commands: {},
      ...this.parseDataAttributes(),
      ...options
    };
    
    this.history = [];
    this.historyIndex = 0;
    this.isTyping = false;
    
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
    // Auto-enfoque después de un pequeño delay
    setTimeout(() => {
      this.inputElement.focus();
    }, 100);
  }

  /**
   * Renderiza la estructura del terminal
   */
  render() {
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
    this.inputElement = this.element.querySelector('.terminal-input');
    this.promptElement = this.element.querySelector('.prompt');
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    this.inputElement.addEventListener('keydown', (e) => {
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

    // Auto focus en el input
    this.element.addEventListener('click', () => {
      this.inputElement.focus();
    });
  }

  /**
   * Procesa un comando
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

    // Comandos definidos por el usuario
    if (this.options.commands[command]) {
      this.addToOutput(this.options.commands[command]);
    } else {
      this.addToOutput(`Comando no encontrado: ${command}. Escribe 'help' para ver comandos disponibles.`);
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
   * Añade salida al terminal
   */
  addToOutput(content) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = content;
    this.outputElement.appendChild(line);
    
    // Scroll al final
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
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