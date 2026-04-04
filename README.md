# Terminus

[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://memoriainfinita.github.io/terminus/)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-informational)]()

Terminal embebible para la web. Vanilla HTML/CSS/JS — sin dependencias, sin frameworks.

## Instalación

### CSS + JS separados
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.min.css">
<script src="https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.min.js" defer></script>

<div class="gnu-terminal"
     style="height:400px;"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Terminus v2.0"}'></div>
```

### Bundle todo-en-uno
```html
<script src="https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/terminal.bundle.min.js" defer></script>

<div class="gnu-terminal" style="height:400px;" data-theme="dark" data-prompt="gnu$"></div>
```

## Atributos HTML

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `data-theme` | string | `dark` · `matrix` · `ocean` · `amber` |
| `data-prompt` | string | Texto del prompt. Default: `gnu$` |
| `data-welcome` | string | Mensaje inicial, soporta `\n` |
| `data-commands` | JSON | Comandos estáticos como objeto JSON |
| `data-autofocus` | flag | Enfoca el input al cargar la página |
| `data-titlebar` | string | `mac` (default) · `linux` · `none` · `custom` |

> El componente requiere `height` fijo (no `min-height`) para que el scroll sea interno. Sin él, el terminal crece y la página scrollea en lugar del contenido.

## API JavaScript

```js
const t = document.getElementById('mi-terminal').terminalComponent;
// o: window.terminalInstances[0]

// Output
t.addToOutput('texto plano');
t.addOutputHTML('<span style="color:#0f0">OK</span>');
t.clear();

// Prompt y comandos
t.setPrompt('user@host:~$');
t.setCommands({
  'ping': (args, term) => {
    const host = args[0] || 'localhost';
    term.addOutputHTML(`Reply from <b>${host}</b>: time=1ms`);
  }
});

// Demo animada
await t.play([
  { type: 'output',   text: 'Starting...',  delay: 300 },
  { type: 'cmd',      text: 'whoami',       delay: 800 },
  { type: 'progress', text: 'Downloading',  steps: 20, stepDelay: 60, delay: 400 },
  { type: 'clear' },
]);
// Tipos: 'cmd' | 'output' | 'outputHTML' | 'progress' | 'clear' | 'pause'
// progress acepta: text, steps, stepDelay, delay

// Input inline (devuelve Promise)
const user = await t.readline('Username: ');

// Modo TUI (captura teclado y clicks, oculta el input)
t.enterMode({
  onKey:   (key, e, term) => { /* navegar */ },
  onClick: (x, y, row, col, term) => { /* seleccionar */ },
  onCtrlC: (term) => term.exitMode()
});
t.exitMode();

// Tab autocomplete contextual
t.options.onTab = (val, term) => {
  const files = ['README.md', 'src/', 'dist/'];
  const word = val.split(' ').pop();
  const matches = files.filter(f => f.startsWith(word));
  if (matches.length === 1) term.inputElement.value = val.slice(0, -word.length) + matches[0];
  else if (matches.length > 1) term.addToOutput(matches.join('  '));
};
// Nota: el autocomplete por defecto solo completa comandos de una sola palabra.
// Para paths, flags o argumentos, define onTab como arriba.

// Dimensiones del viewport
console.log(t.rows, t.cols);
```

## Estructura

```
terminus/
├── src/
│   ├── terminal.css    # Estilos del componente (distribuido via CDN)
│   ├── terminal.js     # Lógica del componente (distribuido via CDN)
│   └── build.js        # Build script
├── docs/
│   ├── index.html      # Página de documentación (GitHub Pages)
│   ├── page.css        # Estilos del site
│   ├── page.js         # Lógica del configurador
│   └── dist/           # Output del build
│       ├── terminal.min.css
│       ├── terminal.min.js
│       ├── terminal.bundle.min.js
│       ├── page.min.css
│       └── page.min.js
└── package.json
```

## Desarrollo

```bash
git clone https://github.com/memoriainfinita/terminus.git
cd terminus
npm install
node ./src/build.js   # genera docs/dist/
npm run serve         # docs/ en http://localhost:8080
```

## Distribución (CDN)

```
https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist/
```

- `terminal.min.css` — 3.6 KB
- `terminal.min.js` — 8.5 KB
- `terminal.bundle.min.js` — 12.4 KB (CSS + JS)

## Licencia

GPL v3.

Desarrollado por [@memoriainfinita](https://github.com/memoriainfinita) con asistencia de Claude Sonnet 4.6 (Anthropic).
