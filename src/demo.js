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
    this.initTheme();
  }

  /**
   * Cachea referencias a elementos del DOM
   */
  cacheElements() {
    this.elements = {
      sidebar: document.getElementById('sidebar'),
      btnSidebar: document.getElementById('btnSidebar'),
      btnTheme: document.getElementById('btnTheme'),
      codeBlock: document.getElementById('codeBlock'),
      btnCopy: document.getElementById('btnCopy'),
      toast: document.getElementById('toast'),
      backdrop: document.getElementById('backdrop'),
      btnModal: document.getElementById('btnModal'),
      btnCloseModal: document.getElementById('btnCloseModal'),
      optCursor: document.getElementById('optCursor'),
      optType: document.getElementById('optType'),
      viewport: document.getElementById('terminalViewport')
    };
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    this.setupSidebar();
    this.setupThemeToggle();
    this.setupClipboard();
    this.setupModal();
    this.setupMockControls();
  }

  /**
   * Configura la funcionalidad del sidebar
   */
  setupSidebar() {
    if (!this.elements.btnSidebar || !this.elements.sidebar) return;

    this.elements.btnSidebar.addEventListener('click', () => {
      const isOpen = this.elements.sidebar.classList.toggle('open');
      this.elements.sidebar.setAttribute('aria-hidden', String(!isOpen));
      this.elements.btnSidebar.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /**
   * Configura el toggle de temas
   */
  setupThemeToggle() {
    if (!this.elements.btnTheme) return;

    this.elements.btnTheme.addEventListener('click', () => {
      this.cycleTheme();
    });
  }

  /**
   * Cicla entre temas (dark/light/auto)
   */
  cycleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
    
    html.setAttribute('data-theme', next);
    
    // Actualiza el texto del botón
    const buttonTexts = {
      dark: 'Claro/Oscuro',
      light: 'Auto',
      auto: 'Oscuro'
    };
    
    this.elements.btnTheme.textContent = buttonTexts[next];
  }

  /**
   * Inicializa el tema basado en la preferencia del sistema
   */
  initTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    
    const buttonTexts = {
      dark: 'Claro/Oscuro',
      light: 'Auto', 
      auto: 'Oscuro'
    };
    
    if (this.elements.btnTheme) {
      this.elements.btnTheme.textContent = buttonTexts[currentTheme];
    }
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
        this.showToast('Copiado al portapapeles ✅');
      } catch (error) {
        console.error('Error al copiar:', error);
        this.showToast('Error al copiar al portapapeles ❌');
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
  if (document.querySelector('.demo-page') || document.querySelector('#sidebar')) {
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