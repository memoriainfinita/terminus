# Terminus — Terminal Embebida GNU

[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/)
[![License](https://img.shields.io/badge/license-GNU-blue)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-informational)]()

## Descripción
**Terminus** es una terminal embebible para la web, creada bajo el espíritu del software libre (GNU). Su objetivo es ofrecer una interfaz ligera, modular y sin dependencias que pueda integrarse en cualquier página HTML con un simple snippet.

## Características principales
- **HTML/CSS/JS puro** — sin frameworks ni APIs externas
- **Modo auto-init** — se activa automáticamente al detectar un elemento con la clase `gnu-terminal`
- **Sistema de temas avanzado** — Matrix, Ocean, Amber y Dark con CSS variables
- **Configurador interactivo en tiempo real** — cambia temas, prompts y comandos instantáneamente
- **Diseño profesional optimizado** con tipografía *Inter* + *IBM Plex Mono*
- **Microinteracciones técnicas** (cursor parpadeante, escritura gradual, animaciones suaves)
- **Responsive** y compatible con modo claro/oscuro
- **API programable completa** — 7 primitivos v2.0 para simulaciones avanzadas
- **Extensible** — pensado para crecer hacia mini-docs o componentes adicionales
- **Súper ligero** — Solo 4.9 KB CSS + 7.1 KB JS minificados para funcionalidad completa

### Primitivos v2.0 (nuevas capacidades)
| Primitivo | Método | Descripción |
|-----------|--------|-------------|
| P1 | `addOutputHTML(html)` | Output con HTML y colores inline |
| P2 | Comandos como función | `(args, terminal) => {}` — lógica, flags, async |
| P3 | `enterMode(handler)` / `exitMode()` | Modo TUI — captura teclado y clicks |
| P4 | `play(script)` | Demo automática con animación de escritura |
| P5 | Tab autocomplete + Ctrl+C | Integrado, configurable con `onTab` |
| P6 | `readline(promptText)` | Input inline async, devuelve Promise |
| P7 | `get rows` / `get cols` | Dimensiones del viewport calculadas en tiempo real |

## Instalación rápida

### Opción 1: CSS + JS separados
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.min.css">
<script src="https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.min.js" defer></script>

<div class="gnu-terminal"
     style="height:400px;"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'></div>
```

### Opción 2: Bundle todo-en-uno
```html
<script src="https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.bundle.min.js" defer></script>

<div class="gnu-terminal"
     style="height:400px;"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'></div>
```

## Demo
Abre `docs/index.html` directamente en el navegador o sirve la carpeta `docs/` con cualquier servidor estático.

## Configuración avanzada

### Temas disponibles
- **Matrix** — Verde clásico tipo Matrix
- **Ocean** — Azul profesional
- **Amber** — Ámbar retro terminal
- **Dark** — Oscuro minimalista

### API JavaScript
```js
const t = document.getElementById('mi-terminal').terminalComponent;

// Output con HTML
t.addOutputHTML('<span style="color:#00ff88">OK</span>');

// Comando como función con argumentos
t.setCommands({
  'ping': (args, term) => {
    const host = args[0] || 'localhost';
    term.addOutputHTML(`Haciendo ping a <b>${host}</b>`);
  },
  'login': async (args, term) => {
    const user = await term.readline('Usuario: ');
    const pass = await term.readline('Contraseña: ');
    term.addOutputHTML(`<span style="color:#0f0">✓ Bienvenido, ${user}</span>`);
  }
});

// Demo automática con animación de escritura
await t.play([
  { type: 'output',   text: 'Iniciando...',  delay: 300 },
  { type: 'cmd',      text: 'whoami',        delay: 800 },
  { type: 'cmd',      text: 'ls',            delay: 700 },
  { type: 'progress', text: 'descargando',  steps: 20, stepDelay: 60, delay: 400 },
  { type: 'pause',    delay: 400 },
]);
// Tipos de paso: 'cmd' | 'output' | 'outputHTML' | 'progress' | 'clear' | 'pause'
// progress acepta: text (prefijo), steps (ancho barra), stepDelay (ms por tick), delay (espera inicial)

// Modo TUI — captura teclado y clicks
t.enterMode({
  onKey:   (key, e, term) => { /* navegar */ },
  onClick: (x, y, row, col, term) => { /* seleccionar */ },
  onCtrlC: (term) => term.exitMode()
});

// Tab autocomplete — por defecto completa nombres de comando de una sola palabra.
// Para completado contextual (paths, flags, argumentos) define onTab:
t.options.onTab = (val, term) => {
  const files = ['README.md', 'src/', 'dist/'];
  const match = files.filter(f => f.startsWith(val.split(' ').pop()));
  if (match.length === 1) term.inputElement.value = match[0];
  else if (match.length > 1) term.addToOutput(match.join('  '));
};

// Dimensiones del viewport
console.log(t.rows, t.cols);
```

### Configuración por data-attributes
| Atributo | Descripción | Valores | Ejemplo |
|-----------|-------------|---------|---------|
| `data-theme` | Tema visual | `matrix`, `ocean`, `amber`, `dark` | `data-theme="matrix"` |
| `data-prompt` | Texto del prompt | Cualquier string | `data-prompt="user@terminus:~$"` |
| `data-welcome` | Mensaje de bienvenida | Texto multilínea | `data-welcome="¡Bienvenido!"` |
| `data-commands` | Comandos simulados (JSON) | Objeto JSON | `data-commands='{"help":"Ayuda"}'` |
| `data-autofocus` | Enfocar el input al cargar | Sin valor (flag) | `data-autofocus` |

> **Altura obligatoria:** el componente requiere `height` fijo (no `min-height`) para que el scroll interno funcione. Sin él, el terminal crece indefinidamente y la página scrollea en lugar del contenido del terminal. Usa `style="height:400px;"` o una clase CSS equivalente.

### Ejemplo avanzado con configurador:
```html
<div class="gnu-terminal"
     data-theme="matrix"
     data-prompt="user@terminus:~$"
     data-welcome="Bienvenido a TERMINUS

Comandos disponibles:
• help - Lista completa de comandos
• ls - Listar contenido
• echo 'mensaje' - Mostrar texto
• theme - Cambiar tema
• clear - Limpiar pantalla"
     data-commands='{
       "help": "Comandos: ls, echo, theme, clear, about",
       "ls": "directorio1/\ndirectorio2/\narchivo.txt",
       "about": "TERMINUS v2.0 - Terminal Component",
       "theme": "Temas: matrix, ocean, amber, dark"
     }'>
</div>
```

## Desarrollo

### Clonar repositorio
```bash
git clone https://github.com/memoriainfinita/terminus.git
cd terminus
npm install
```

### Scripts disponibles
```bash
npm run build    # Construir archivos minificados
npm run dev      # Servidor desarrollo (puerto 8000)
npm run serve    # Servidor docs (puerto 8080)
```

### Estructura del proyecto
```
terminus/
├── docs/                    # GitHub Pages
│   ├── index.html           # Página de demo con configurador
│   └── dist/                # Archivos distribuibles (CDN)
├── src/                     # Código fuente
│   ├── terminal.css         # Estilos del componente
│   ├── terminal.js          # Lógica del componente
│   ├── demo.css             # Estilos de la página demo
│   ├── demo.js              # Configurador interactivo
│   ├── page-styles.css      # Design system de la página
│   └── build.js             # Sistema de build
└── package.json
```

## Archivos de Distribución

### Core Terminal (Listo para producción)
- `terminal.min.css` — 4.9 KB (estilos optimizados -40.8%)
- `terminal.min.js` — 7.1 KB (v2.0 con 7 primitivos)
- `terminal.bundle.min.js` — 12.3 KB (CSS + JS todo-en-uno)

### Demo Interactivo
- `demo.min.css` — 4.2 KB
- `demo.min.js` — 11.8 KB
- `page-styles.min.css` — Sistema de diseño unificado

### URLs de CDN (jsDelivr)
```
https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/
```

Una vez que existan git tags, se podrá anclar a una versión específica (`@v2.0.0`).

## Filosofía
Inspirado en la sencillez del software libre: **código claro, integrable y accesible para todos los niveles técnicos**.

## Tecnologías
- HTML5 + CSS3 (sin frameworks)
- Vanilla JavaScript
- jsDelivr para distribución via CDN
- Build system con clean-css y uglify-js

## Contribuir
1. Haz un fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcion`
3. Haz commit de tus cambios: `git commit -m 'Añadir nueva función'`
4. Envía un pull request

## Desarrollo Asistido por IA
Proyecto desarrollado por [@memoriainfinita](https://github.com/memoriainfinita) con asistencia de **Claude Sonnet 4.6** (Anthropic).

## Estadísticas del Build (v2.0.0)
- **Reducción CSS**: 40.8% (8.3 KB → 4.9 KB)
- **JS v2.0**: 16.4 KB fuente → 7.1 KB minificado (-56.9%)
- **Bundle total**: 12.3 KB (CSS + JS)
- **Tiempo de build**: ~10 segundos

## Licencia
Publicado bajo **Licencia GNU** — libre, abierta y comunitaria.

---
**Terminus** © 2026 — Un proyecto GNU minimalista para terminales embebibles.

**Última actualización**: Abril 2026 — v2.0.0: 7 primitivos de simulación (addOutputHTML, comandos función, enterMode TUI, play, readline, Tab, rows/cols)

Desarrollado por [@memoriainfinita](https://github.com/memoriainfinita)
