/**
 * TERMINUS - Demo Page Interactions
 * Funcionalidades específicas para la página de demostración
 * Versión: 1.0.0
 */

class TerminusDemo {
  constructor() {
    this.elements = {};
    this.init();
  }

  /**
   * Inicializa la demo
   */
  init() {
    this.cacheElements();
    this.setupEventListeners();
  }

  /**
   * Cachea referencias a elementos del DOM
   */
  cacheElements() {
    this.elements = {
      // Elementos de navegación
      codeBlock: document.getElementById('codeBlock'),
      btnCopy: document.getElementById('btnCopy'),
      toast: document.getElementById('toast'),
      backdrop: document.getElementById('backdrop'),
      btnModal: document.getElementById('btnModal'),
      btnCloseModal: document.getElementById('btnCloseModal'),
      
      // Elementos del configurador
      themeSelector: document.getElementById('themeSelector'),
      promptInput: document.getElementById('promptInput'),
      welcomeInput: document.getElementById('welcomeInput'),
      newCommandName: document.getElementById('newCommandName'),
      newCommandResponse: document.getElementById('newCommandResponse'),
      addCommandBtn: document.getElementById('addCommandBtn'),
      commandsList: document.getElementById('commandsList'),
      updatePreviewBtn: document.getElementById('updatePreviewBtn'),
      generateSnippetBtn: document.getElementById('generateSnippetBtn'),
      resetConfigBtn: document.getElementById('resetConfigBtn'),
      
      // Elementos del snippet generado
      copyGeneratedSnippet: document.getElementById('copyGeneratedSnippet'),
      downloadConfig: document.getElementById('downloadConfig'),
      cdnProvider: document.getElementById('cdnProvider'),
      generatedCode: document.getElementById('generatedCode'),
      
      // Terminal de demo
      terminal: document.getElementById('terminalDemo')
    };
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    this.setupClipboard();
    this.setupModal();
    this.setupConfigurator();
  }

  /**
   * Configura la funcionalidad de copiar al portapapeles
   */
  setupClipboard() {
    if (!this.elements.btnCopy) return;

    this.elements.btnCopy.addEventListener('click', async () => {
      try {
        const textToCopy = this.elements.codeBlock ? this.elements.codeBlock.innerText : '';
        await navigator.clipboard.writeText(textToCopy);
        this.showToast('Copiado al portapapeles');
      } catch (error) {
        console.error('Error al copiar:', error);
        this.showToast('Error al copiar al portapapeles');
      }
    });
  }

  /**
   * Muestra una notificación toast
   */
  showToast(message, duration = 1600) {
    if (!this.elements.toast) return;

    this.elements.toast.textContent = message;
    this.elements.toast.classList.add('show');
    
    setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, duration);
  }

  /**
   * Configura la funcionalidad del modal
   */
  setupModal() {
    if (!this.elements.btnModal || !this.elements.backdrop) return;

    // Abrir modal
    this.elements.btnModal.addEventListener('click', () => {
      this.openModal();
    });

    // Cerrar modal con botón
    if (this.elements.btnCloseModal) {
      this.elements.btnCloseModal.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Cerrar modal haciendo clic en el backdrop
    this.elements.backdrop.addEventListener('click', (e) => {
      if (e.target === this.elements.backdrop) {
        this.closeModal();
      }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.backdrop.classList.contains('open')) {
        this.closeModal();
      }
    });
  }

  /**
   * Abre el modal
   */
  openModal() {
    this.elements.backdrop.classList.add('open');
    this.elements.backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  }

  /**
   * Cierra el modal
   */
  closeModal() {
    this.elements.backdrop.classList.remove('open');
    this.elements.backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaurar scroll
  }

  /**
   * Configura los controles mock de la demo
   */
  setupMockControls() {
    if (!this.elements.viewport) return;

    // Control del cursor parpadeante
    if (this.elements.optCursor) {
      this.elements.optCursor.addEventListener('change', (e) => {
        const cursors = this.elements.viewport.querySelectorAll('.cursor');
        cursors.forEach(cursor => {
          cursor.style.display = e.target.checked ? 'inline-block' : 'none';
        });
      });
    }

    // Control de la animación de escritura
    if (this.elements.optType) {
      this.elements.optType.addEventListener('change', (e) => {
        const typingElements = this.elements.viewport.querySelectorAll('.typing');
        typingElements.forEach(element => {
          element.style.animationPlayState = e.target.checked ? 'running' : 'paused';
        });
      });
    }
  }

  /**
   * Configura el sistema de configuración completo
   */
  setupConfigurator() {
    // Inicializar configuración por defecto
    this.config = {
      theme: 'matrix',
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

  /**
   * Configura todos los event listeners del configurador
   */
  setupConfiguratorEvents() {
    // Theme selector
    if (this.elements.themeSelector) {
      this.elements.themeSelector.addEventListener('change', (e) => {
        this.config.theme = e.target.value;
        this.updatePreview();
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
      this.elements.newCommandResponse.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addCommand();
      });
    }

    // Action buttons
    if (this.elements.updatePreviewBtn) {
      this.elements.updatePreviewBtn.addEventListener('click', () => {
        this.updatePreview();
      });
    }

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

    // Download config
    if (this.elements.downloadConfig) {
      this.elements.downloadConfig.addEventListener('click', () => {
        this.downloadConfiguration();
      });
    }

    // CDN provider change
    if (this.elements.cdnProvider) {
      this.elements.cdnProvider.addEventListener('change', () => {
        this.generateSnippet();
      });
    }
  }

  /**
   * Añade un nuevo comando personalizado
   */
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

    // Agregar comando
    this.config.commands[name] = response;
    
    // Limpiar inputs
    this.elements.newCommandName.value = '';
    this.elements.newCommandResponse.value = '';

    // Actualizar UI
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();
    this.showToast(`Comando "${name}" agregado`);
  }

  /**
   * Elimina un comando
   */
  removeCommand(commandName) {
    delete this.config.commands[commandName];
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();
    this.showToast(`Comando "${commandName}" eliminado`);
  }

  /**
   * Edita un comando existente
   */
  editCommand(commandName, currentResponse) {
    // Rellenar los inputs con los valores actuales
    if (this.elements.newCommandName) {
      this.elements.newCommandName.value = commandName;
    }
    if (this.elements.newCommandResponse) {
      this.elements.newCommandResponse.value = currentResponse;
    }

    // Eliminar el comando actual para evitar duplicados
    delete this.config.commands[commandName];
    this.renderCommandsList();
    this.updatePreview();
    this.generateSnippet();

    // Mensaje informativo
    this.showToast(`Editando "${commandName}" - Modifica y presiona Agregar`);
  }

  /**
   * Renderiza la lista de comandos
   */
  renderCommandsList() {
    if (!this.elements.commandsList) return;

    const commandsHTML = Object.entries(this.config.commands).map(([name, response]) => `
      <div class="command-item" style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid var(--border);">
        <span style="font-family: monospace; color: var(--accent);">${name}</span>
        <span style="flex: 1; margin-left: 8px; font-size: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${response}</span>
        <div style="display: flex; gap: 4px;">
          <button class="btn-edit" onclick="window.terminusDemo.editCommand('${name}', \`${response.replace(/`/g, '\\`')}\`)" 
                  style="background: none; border: none; color: var(--accent); cursor: pointer; padding: 2px 6px; font-size: 12px;" 
                  title="Editar comando">✏️</button>
          <button class="btn-remove" onclick="window.terminusDemo.removeCommand('${name}')" 
                  style="background: none; border: none; color: #f45452; cursor: pointer; padding: 2px 6px;" 
                  title="Eliminar comando">✕</button>
        </div>
      </div>
    `).join('');

    this.elements.commandsList.innerHTML = commandsHTML || '<div style="text-align: center; color: var(--muted); padding: 16px;">No hay comandos personalizados</div>';
  }

  /**
   * Actualiza el preview del terminal
   */
  updatePreview() {
    if (!this.elements.terminal) return;

    // Remover tema anterior forzando re-render
    this.elements.terminal.removeAttribute('data-theme');
    
    // Aplicar nueva configuración
    setTimeout(() => {
      this.elements.terminal.dataset.theme = this.config.theme;
      this.elements.terminal.dataset.prompt = this.config.prompt;
      this.elements.terminal.dataset.welcome = this.config.welcome;
      this.elements.terminal.dataset.commands = JSON.stringify(this.config.commands);

      // Actualizar elementos visuales
      const promptElement = this.elements.terminal.querySelector('.prompt');
      if (promptElement) {
        promptElement.textContent = this.config.prompt;
      }

      // Actualizar instancia del terminal si existe
      if (window.terminalInstances) {
        const terminalInstance = window.terminalInstances.find(t => t.element === this.elements.terminal);
        if (terminalInstance) {
          terminalInstance.options.theme = this.config.theme;
          terminalInstance.options.prompt = this.config.prompt;
          terminalInstance.options.commands = this.config.commands;
          
          // Aplicar tema
          if (terminalInstance.applyTheme) {
            terminalInstance.applyTheme();
          }
          
          // Actualizar prompt visual
          if (terminalInstance.setPrompt) {
            terminalInstance.setPrompt(this.config.prompt);
          }
          
          // Limpiar y mostrar nuevo mensaje de bienvenida
          if (terminalInstance.clear && terminalInstance.showWelcomeMessage) {
            terminalInstance.clear();
            terminalInstance.showWelcomeMessage();
          }
        }
      }
      
      // Forzar re-renderizado
      this.elements.terminal.offsetHeight;
      
    }, 10);

    this.showToast('Preview actualizado');
  }

  /**
   * Genera el snippet de código
   */
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

    const linkTag = cssUrl ? `&lt;link rel="stylesheet" href="${cssUrl}"&gt;\n` : '';
    const snippet = `${linkTag}&lt;script src="${jsUrl}" defer&gt;&lt;/script&gt;

&lt;div class="gnu-terminal"
     data-theme="${this.config.theme}"
     data-prompt="${this.escapeHtml(this.config.prompt)}"${welcomeAttr}${commandsAttr}&gt;
&lt;/div&gt;`;

    this.elements.generatedCode.innerHTML = snippet;
  }

  /**
   * Escapa HTML para atributos
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/"/g, '&quot;');
  }

  /**
   * Copia el snippet generado
   */
  async copySnippet() {
    if (!this.elements.generatedCode) return;

    const snippet = this.elements.generatedCode.textContent;
    
    try {
      await navigator.clipboard.writeText(snippet);
      this.showToast('Snippet copiado al portapapeles');
    } catch (err) {
      // Fallback para navegadores antiguos
      const textarea = document.createElement('textarea');
      textarea.value = snippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('Snippet copiado');
    }
  }

  /**
   * Descarga la configuración como JSON
   */
  downloadConfiguration() {
    const configJson = JSON.stringify(this.config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terminus-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showToast('Configuración descargada');
  }

  /**
   * Resetea la configuración a los valores por defecto
   */
  resetConfiguration() {
    if (!confirm('¿Estás seguro de que quieres resetear toda la configuración?')) return;

    // Resetear configuración
    this.config = {
      theme: 'matrix',
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

  /**
   * Carga la configuración en los inputs
   */
  loadConfiguration() {
    if (this.elements.themeSelector) {
      this.elements.themeSelector.value = this.config.theme;
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

  /**
   * Destruye la instancia y limpia event listeners
   */
  destroy() {
    // En una implementación más compleja, aquí limpiaríamos todos los event listeners
    // Para esta demo, no es necesario ya que los elementos se manejan automáticamente
  }
}

/**
 * Auto-inicialización de la demo
 */
function initDemo() {
  // Solo inicializar si estamos en la página de demo
  if (document.querySelector('.demo-page')) {
    window.terminusDemo = new TerminusDemo();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemo);
} else {
  initDemo();
}

// Exportar para uso manual
window.TerminusDemo = TerminusDemo;
