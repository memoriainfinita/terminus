/**
 * TERMINUS — page.js
 * Documentation site logic: configurator, snippets, toasts.
 * v2.0.0
 */

class TerminusDemo {
  constructor() {
    this.elements = {};
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
  }

  cacheElements() {
    this.elements = {
      // Navigation elements
      toast: document.getElementById('toast'),
      backdrop: document.getElementById('backdrop'),
      btnCloseModal: document.getElementById('btnCloseModal'),
      
      // Configurator elements
      themeSelector: document.getElementById('themeSelector'),
      promptInput: document.getElementById('promptInput'),
      welcomeInput: document.getElementById('welcomeInput'),
      newCommandName: document.getElementById('newCommandName'),
      newCommandResponse: document.getElementById('newCommandResponse'),
      addCommandBtn: document.getElementById('addCommandBtn'),
      commandsList: document.getElementById('commandsList'),
      titlebarSelector: document.getElementById('titlebarSelector'),
      autofocusCheck: document.getElementById('autofocusCheck'),
      generateSnippetBtn: document.getElementById('generateSnippetBtn'),
      resetConfigBtn: document.getElementById('resetConfigBtn'),
      
      // Generated snippet elements
      copyGeneratedSnippet: document.getElementById('copyGeneratedSnippet'),
      cdnProvider: document.getElementById('cdnProvider'),
      generatedCode: document.getElementById('generatedCode'),
      
      // Demo terminal
      terminal: document.getElementById('terminalDemo')
    };
  }

  setupEventListeners() {
    this.setupModal();
    this.setupConfigurator();
  }

  showToast(message, duration = 1600) {
    if (!this.elements.toast) return;

    this.elements.toast.textContent = message;
    this.elements.toast.classList.add('show');
    
    setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, duration);
  }

  setupModal() {
    if (!this.elements.backdrop) return;

    // Close modal with button
    if (this.elements.btnCloseModal) {
      this.elements.btnCloseModal.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Close modal on backdrop click
    this.elements.backdrop.addEventListener('click', (e) => {
      if (e.target === this.elements.backdrop) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.backdrop.classList.contains('open')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.elements.backdrop.classList.add('open');
    this.elements.backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.elements.backdrop.classList.remove('open');
    this.elements.backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  setupConfigurator() {
    // Initialize default configuration
    this.config = {
      theme: 'matrix',
      titlebar: 'mac',
      autofocus: false,
      prompt: 'user@terminus:~$',
      welcome: 'Bienvenido a mi terminal personalizada!\n\nComandos disponibles:\n\u2022 help - Ver ayuda\n\u2022 about - Información del proyecto',
      commands: {
        'help': 'Ver comandos disponibles',
        'about': 'Terminal GNU embebible v2.0'
      }
    };

    this.setupConfiguratorEvents();
    this.loadConfiguration();
    this.updatePreview();
  }

  setupConfiguratorEvents() {
    // Theme selector
    if (this.elements.themeSelector) {
      this.elements.themeSelector.addEventListener('change', (e) => {
        this.config.theme = e.target.value;
        this.updatePreview();
        this.generateSnippet();
      });
    }

    // Titlebar selector
    if (this.elements.titlebarSelector) {
      this.elements.titlebarSelector.addEventListener('change', (e) => {
        this.config.titlebar = e.target.value;
        this.updatePreview();
        this.generateSnippet();
      });
    }

    // Autofocus checkbox
    if (this.elements.autofocusCheck) {
      this.elements.autofocusCheck.addEventListener('change', (e) => {
        this.config.autofocus = e.target.checked;
        this.generateSnippet();
      });
    }

    // Prompt input
    if (this.elements.promptInput) {
      this.elements.promptInput.addEventListener('input', (e) => {
        this.config.prompt = e.target.value || 'gnu$';
        this.updatePreview();
        this.generateSnippet();
      });
    }

    // Welcome message
    if (this.elements.welcomeInput) {
      this.elements.welcomeInput.addEventListener('input', (e) => {
        this.config.welcome = e.target.value;
        this.updatePreview();
        this.generateSnippet();
      });
    }

    // Add command button
    if (this.elements.addCommandBtn) {
      this.elements.addCommandBtn.addEventListener('click', () => {
        this.addCommand();
      });
    }

    // Enter key in command inputs
    if (this.elements.newCommandName) {
      this.elements.newCommandName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addCommand();
      });
    }
    if (this.elements.newCommandResponse) {
      this.elements.newCommandResponse.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          this.addCommand();
        }
      });
    }

    // Action buttons
    if (this.elements.generateSnippetBtn) {
      this.elements.generateSnippetBtn.addEventListener('click', () => {
        this.generateSnippet();
        this.openModal();
      });
    }

    if (this.elements.resetConfigBtn) {
      this.elements.resetConfigBtn.addEventListener('click', () => {
        this.resetConfiguration();
      });
    }

    // Copy generated snippet
    if (this.elements.copyGeneratedSnippet) {
      this.elements.copyGeneratedSnippet.addEventListener('click', () => {
        this.copySnippet();
      });
    }

    // CDN provider change
    if (this.elements.cdnProvider) {
      this.elements.cdnProvider.addEventListener('change', () => {
        this.generateSnippet();
      });
    }
  }

  addCommand() {
    const name = this.elements.newCommandName?.value.trim();
    const response = this.elements.newCommandResponse?.value.trim();

    if (!name || !response) {
      this.showToast('Completa ambos campos para agregar el comando');
      return;
    }

    if (this.config.commands[name]) {
      this.showToast('El comando ya existe. Usa otro nombre.');
      return;
    }

    // Add command
    this.config.commands[name] = response;
    
    // Clear inputs
    this.elements.newCommandName.value = '';
    this.elements.newCommandResponse.value = '';

    // Update UI
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();
    this.showToast(`Comando "${name}" agregado`);
  }

  removeCommand(commandName) {
    delete this.config.commands[commandName];
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();
    this.showToast(`Comando "${commandName}" eliminado`);
  }

  editCommand(commandName, currentResponse) {
    if (this.elements.newCommandName) {
      this.elements.newCommandName.value = commandName;
    }
    if (this.elements.newCommandResponse) {
      this.elements.newCommandResponse.value = currentResponse;
    }

    // Remove current command to avoid duplicates
    delete this.config.commands[commandName];
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();

    this.showToast(`Editando "${commandName}" - Modifica y presiona Agregar`);
  }

  renderCommandsList() {
    if (!this.elements.commandsList) return;

    const commandsHTML = Object.entries(this.config.commands).map(([name, response]) => `
      <div class="command-item" style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid var(--border);">
        <span style="font-family: monospace; color: var(--accent);">${name}</span>
        <span style="flex: 1; margin-left: 8px; font-size: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${response}</span>
        <div style="display: flex; gap: 4px;">
          <button onclick="window.terminusDemo.editCommand('${name}', \`${response.replace(/`/g, '\\`')}\`)"
                  style="background: none; border: none; color: var(--accent); cursor: pointer; padding: 2px 6px; font-size: 12px;" 
                  title="Editar comando">&#9998;</button>
          <button class="btn-remove" onclick="window.terminusDemo.removeCommand('${name}')" 
                  style="background: none; border: none; color: #f45452; cursor: pointer; padding: 2px 6px;" 
                  title="Eliminar comando">&#x2715;</button>
        </div>
      </div>
    `).join('');

    this.elements.commandsList.innerHTML = commandsHTML || '<div style="text-align: center; color: var(--muted); padding: 16px;">No hay comandos personalizados</div>';
  }

  updatePreview() {
    if (!this.elements.terminal) return;

    this.elements.terminal.dataset.theme = this.config.theme;
    this.elements.terminal.dataset.prompt = this.config.prompt;
    this.elements.terminal.dataset.welcome = this.config.welcome;
    this.elements.terminal.dataset.commands = JSON.stringify(this.config.commands);

    // Update terminal instance if it exists
    if (window.terminalInstances) {
      const terminalInstance = window.terminalInstances.find(t => t.element === this.elements.terminal);
      if (terminalInstance) {
        terminalInstance.options.theme = this.config.theme;
        terminalInstance.options.titlebar = this.config.titlebar;
        terminalInstance.options.prompt = this.config.prompt;
        terminalInstance.options.commands = this.config.commands;

        terminalInstance.applyTheme();
        terminalInstance.applyTitlebar();
        terminalInstance.setPrompt(this.config.prompt);
        terminalInstance.clear();
        terminalInstance.showWelcomeMessage();
      }
    }
  }

  generateSnippet() {
    if (!this.elements.generatedCode) return;

    const cdnProvider = this.elements.cdnProvider?.value || 'jsdelivr';
    let cssUrl, jsUrl;

    switch (cdnProvider) {
      case 'jsdelivr':
        cssUrl = 'https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.min.css';
        jsUrl = 'https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.min.js';
        break;
      case 'github':
        cssUrl = 'https://memoriainfinita.github.io/terminus/dist/terminal.min.css';
        jsUrl = 'https://memoriainfinita.github.io/terminus/dist/terminal.min.js';
        break;
      case 'bundle':
        cssUrl = null;
        jsUrl = 'https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.bundle.min.js';
        break;
    }

    const welcomeAttr = this.config.welcome ? `\n     data-welcome="${this.escapeHtml(this.config.welcome)}"` : '';
    const commandsAttr = Object.keys(this.config.commands).length > 0 ? `\n     data-commands='${JSON.stringify(this.config.commands)}'` : '';
    const titlebarAttr = this.config.titlebar !== 'mac' ? `\n     data-titlebar="${this.config.titlebar}"` : '';
    const autofocusAttr = this.config.autofocus ? '\n     data-autofocus' : '';

    const linkTag = cssUrl ? `&lt;link rel="stylesheet" href="${cssUrl}"&gt;\n` : '';
    const snippet = `${linkTag}&lt;script src="${jsUrl}" defer&gt;&lt;/script&gt;

&lt;div class="gnu-terminal"
     style="height: 400px;"
     data-theme="${this.config.theme}"
     data-prompt="${this.escapeHtml(this.config.prompt)}"${titlebarAttr}${autofocusAttr}${welcomeAttr}${commandsAttr}&gt;
&lt;/div&gt;`;

    this.elements.generatedCode.innerHTML = snippet;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/"/g, '&quot;');
  }

  async copySnippet() {
    if (!this.elements.generatedCode) return;

    const snippet = this.elements.generatedCode.textContent;
    
    try {
      await navigator.clipboard.writeText(snippet);
      this.showToast('Snippet copiado al portapapeles');
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = snippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('Snippet copiado');
    }
  }

  resetConfiguration() {
    if (!confirm('¿Estás seguro de que quieres resetear toda la configuración?')) return;

    this.config = {
      theme: 'matrix',
      titlebar: 'mac',
      autofocus: false,
      prompt: 'user@terminus:~$',
      welcome: 'Bienvenido a mi terminal personalizada!\n\nComandos disponibles:\n\u2022 help - Ver ayuda\n\u2022 about - Información del proyecto',
      commands: {
        'help': 'Ver comandos disponibles',
        'about': 'Terminal GNU embebible v2.0'
      }
    };

    this.loadConfiguration();
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();
    this.showToast('Configuración reseteada');
  }

  loadConfiguration() {
    if (this.elements.themeSelector) {
      this.elements.themeSelector.value = this.config.theme;
    }
    if (this.elements.titlebarSelector) {
      this.elements.titlebarSelector.value = this.config.titlebar;
    }
    if (this.elements.autofocusCheck) {
      this.elements.autofocusCheck.checked = this.config.autofocus;
    }
    if (this.elements.promptInput) {
      this.elements.promptInput.value = this.config.prompt;
    }
    if (this.elements.welcomeInput) {
      this.elements.welcomeInput.value = this.config.welcome;
    }
    
    this.renderCommandsList();
    this.generateSnippet();
  }

}

function initDemo() {
  if (document.querySelector('.demo-page')) {
    window.terminusDemo = new TerminusDemo();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemo);
} else {
  initDemo();
}

window.TerminusDemo = TerminusDemo;
