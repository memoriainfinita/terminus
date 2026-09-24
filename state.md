---
created: 2026-04-02
last_updated: 2026-09-24
---

# Terminus — state.md

_Última actualización: 2026-09-24_

---

## System

- **Repo:** github.com/memoriainfinita/terminus
- **Branch:** main (limpio, sincronizado con origin/main)
- **Versión:** v2.0.0
- **Stack:** Vanilla HTML/CSS/JS, sin dependencias
- **Build:** `node ./src/build.js` → `docs/dist/` (~10s)
- **Dev server:** `npm run serve` → `cd docs && python -m http.server 8080`
- **GitHub Pages:** ACTIVO en `https://memoriainfinita.github.io/terminus/`

---

## Services

_Ningún servicio corriendo. Proyecto estático._

---

## Preferences

- Sin emojis en ningún archivo del proyecto
- Commits en inglés: `fix:`, `feat:`, `chore:`, `style:`, `docs:`, `refactor:`
- Código: funcional antes que elegante
- Sin slop AI (claims vacíos, textos de relleno, superlativos)
- Idioma de la UI: español (la demo page y los textos de ejemplo)
- Comentarios de código: inglés

---

## Patterns

- [build] Siempre `node ./src/build.js` antes de commit — genera minificados en `docs/dist/`. Confirmed 2026-04.
- [cdn] URL correcta: `https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist`. Tag `@main`, no `@latest`. Confirmed 2026-04.
- [scroll] El auto-scroll usa `viewportElement` (el div con `overflow-y:auto`), no `outputElement` (el div interior sin scroll). Bug corregido en `addToOutput` y `addOutputHTML`. Confirmed 2026-04.
- [play-cmd] `play()` tipo `cmd` anima en el output (no en el input real) y ejecuta con `_execSilent()`. El input-line se oculta durante la animación. Confirmed 2026-04.
- [play-progress] `play()` tipo `progress` anima una barra `[=====>   ] 42%` in-place. Parámetros: `text`, `steps`, `stepDelay`, `delay`. Confirmed 2026-04.
- [readline] La pregunta va al output como línea independiente; el prompt del input-line se reduce a `>` durante la espera. Evita solapamiento con textos largos. Confirmed 2026-04.
- [terminal-height] Usar `height` fijo (no `min-height`) en terminales embebidos para que el flex viewport scrollee en lugar de crecer. Documentado en README y API reference. Confirmed 2026-04.
- [autofocus] Auto-focus opt-in vía `data-autofocus` en el componente. Sin el atributo, no hace focus ni scroll al cargar la página. Confirmed 2026-04.
- [grid-layout] `.grid.grid-2` para ejemplos 2×2 (igual peso). `.grid.cols-2` para configurador (1.1fr / .9fr asimétrico). Confirmed 2026-04.
- [addToOutput-newlines] String handlers con `\n` se renderizan como líneas separadas via `split('\n')` en `processCommand` y `_execSilent`. Igual que `showWelcomeMessage`. Confirmed 2026-04.
- [variables-css] Las variables de site (`--bg-soft`, `--muted`, `--shadow`, `--accent-weak`, `--gap`) viven en `page.css`, no en `terminal.css`. El componente CDN solo expone las que usa internamente. Confirmed 2026-04.
- [css-scope] `terminal.css` (CDN) solo contiene reglas scoped a `.gnu-terminal` y variables `--terminal-*` con fallback. Nada de `:root`, `body`, resets globales ni clases de docs — eso vive en `page.css`. Confirmed 2026-06.

---

## History

### 2026-04-02 — Sesión de polish completo docs/index.html

**Punto de partida:** v2.0.0 funcional pero con ruido visual y varios bugs.

**Cambios realizados (commits `96c016d` → `bb68e1f`):**

| Commit | Cambio |
|--------|--------|
| `96c016d` | Eliminado grid de 4 temas del hero (cubierto por los ejemplos) |
| `ff1afb4` | Eliminado toggle dark/light, la página es siempre dark |
| `04a4acc` | Fix padding de secciones (`.container` sobreescribía `section`) |
| `6dfe186` | Reducir padding de secciones a 48px |
| `51be3f4` | Eliminar "Configurador" del nav; fix tag API a `v2.0.0` |
| `e7dfeb4` | Fix API docs: `lock/unlock` → `enterMode/exitMode`; CDN `@latest` → `@main`; bundle snippet sin CSS link roto |
| `f9b1a18` | Fix padding en `.modal .card-h` / `.modal .card-b` (selector scope) |
| `cd55829` | Limpiar emojis de los 12 toast messages |
| `c3950ee` | Unificar headers de los 4 archivos fuente a formato `TERMINUS — filename / desc / v2.0.0` |
| `3aaaba2` | Toast del configurador solo en acciones explícitas, silencioso en auto-update |
| `8b6a88c` | Eliminar botón "Actualizar Preview" (redundante, auto-update ya funciona) |
| `8838a12` | Eliminar sección de instalación + JS asociado (`setupClipboard`, `codeBlock`, etc.) |
| `19d86c9` | Añadir header de sección a "Referencia API" |
| `24594c5` | Eliminar card-h redundante dentro de la card de API |
| `d471117` | Implementar 4 ejemplos interactivos en vivo: Portfolio (`data-commands`/amber), CI/CD (`play()`/matrix), Voight-Kampff (`readline()`/ocean), WOPR (`enterMode()`/dark) |
| `a5824de` | Fix layout: cambiar grid-4 → grid-2 (2×2); `word-break` en output lines; `overflow-x:hidden` en viewport |
| `bb68e1f` | Fix comportamiento terminal: `height` fijo, flex+overflow en viewport, `data-autofocus` opt-in para no hacer scroll al cargar |
| `100fa59` | Crear `state.md` como fuente de verdad del proyecto |
| `<chore>` | Untrack `state.md` de git, añadido a `.gitignore` — queda local, nunca se pushea |

### 2026-04-03 (sesión 3) — Refactor ejemplos + mejoras play()

| Commit | Cambio |
|--------|--------|
| `68e6ad4` | `play()` anima `cmd` en output con `_typeInput` refactorizado; `_execSilent()` sin echo; tipo `progress` con barra animada in-place |
| `2fd0471` | Ejemplo 1: Elliot Alderson (Mr. Robot) con `data-commands` puro + fake `cd`; Ejemplo 2: Terminus Install con `progress` en curl; Ejemplo 3: MU/TH/UR 6000 (Alien) con `readline()` y easter eggs (ash/ripley/dallas); docs: `progress` en README y API reference |

### 2026-04-03 (sesión 3 — continuación) — Ejemplo 4, bugs terminales, polish Elliot

| Commit | Cambio |
|--------|--------|
| `61cc477` | WOPR → GNU Midnight Commander (Linux 0.01 filesystem, dos paneles) |
| `9233b02` | MC → htop con linux-7.0-rc1 easter egg: kill cc1 (PID 412) → email de Linus Torvalds |
| `6f3b08c` | htop: eliminar F9/F10, todos los ejemplos subidos de 300 → 380px |
| `603f965` | Auditoría de features: enricher todos los ejemplos — Elliot: login+readline+setPrompt+onTab; htop: onClick+rows; play(): paso `clear` |
| `567dd8e` | Fix Elliot: flujo login primero (no cd fsociety/), cd fsociety/ restaurado como comando estático |
| `b810184` | Fix terminal.js: `readline()` usa `Promise.resolve().then()` para restaurar prompt — el caller ejecuta `setPrompt()` primero; `_handleTab` filtra claves multi-palabra para no completar `nmap ` o `cd x/` |
| `593a147` | Polish: Elliot sin hints ni comentarios en respuestas (real terminal style); README: nota sobre onTab y completado multi-palabra |

### 2026-04-03 (sesión 4) — Refactor CSS, data-titlebar, README rewrite

| Cambio | Detalle |
|--------|---------|
| README reescrito | Eliminado slop (Filosofía, Estadísticas del Build, Microinteracciones, etc.); refs obsoletas a demo.css/demo.js/page-styles.css; tamaños correctos (4.5KB/8.2KB); archivado original en `_archive/README-v1.md` |
| `terminal.css` themes deduplicados | Selector `[data-theme]` compartido para reglas estructurales; 113 → 55 líneas en la sección de temas |
| `data-titlebar` nuevo atributo | Modos: `mac` (default, colores macOS), `linux` (dots monocromos), `none` (sin titlebar), `custom` (preserva HTML del usuario) |
| `.dot` scope fix | `.dot` global → `.gnu-terminal .dot` — ya no contamina clases de la página anfitriona |
| Bug `}` extra | Llave duplicada al final de `terminal.css` eliminada |

### 2026-04-04 (sesión 6) — Configurador completo + Windows titlebar + fixes

| Commit | Cambio |
|--------|--------|
| `b4d9b7d` | Configurador: añadidos selector `data-titlebar` (mac/linux/windows/none) y checkbox `data-autofocus`; snippet los incluye condicionalmente |
| `7dd19c5` | `data-titlebar="windows"`: botones − □ × derecha en CSS; `applyTheme()` setea atributo para CSS dinámico; nuevo `applyTitlebar()` actualiza DOM en vivo; `updatePreview()` lo llama al cambiar tipo |
| `82d0ba0` | Fix: listener del selector titlebar no llamaba `updatePreview()` — preview no se actualizaba al cambiar |
| `9bc1c1e` | Campo respuesta de comandos: `<input>` → `<textarea>` para soporte multilinea |
| `72946a1` | Fix terminal.js: string handlers con `\n` ahora renderizan líneas separadas — `processCommand` y `_execSilent` usan `split('\n')`, consistente con `showWelcomeMessage` |
| `b93cfa3` | Fix configurador: Enter en textarea inserta línea, solo Ctrl+Enter guarda el comando |
| `867b2b4` | Ejemplos: `data-titlebar` asignado temáticamente a cada uno |
| `84f235d` | Ejemplos: mac/windows/none/linux — los 4 modos en pantalla |

### 2026-04-04 (sesión 5) — Pre-push cleanup completo

**Commits `a95bb1e` → `3309a95`:**

| Commit | Cambio |
|--------|--------|
| `a95bb1e` | build.js: strings en inglés; README: fix bloque duplicado |
| `c645319` | Limpieza mayor: `.terminal` alias CSS eliminado; variables site movidas a `page.css`; `isTyping` y `offsetHeight` borrados; ~20 JSDoc triviales eliminados; `destroy()` stub borrado; guards defensivos quitados; `btn-edit` fantasma eliminado; ~26 utility classes muertas; `details/summary` y `.form-select` borrados; `#snippet` href→`#demo`; `data-titlebar` en tablas API; `var(--muted)` → `var(--terminal-muted, var(--muted))` en spans temáticos; README: badge Pages, typo `terminust/`, tamaños CDN actualizados |
| `308e194` | Fix `nmap localhost`: de string con `\n` a función con 3 llamadas `addToOutput` |
| `3309a95` | API table completa: `addToOutput`, `rows`/`cols`, `options.onTab`, firma de `enterMode`; generador añade `style="height:400px;"`; tamaños ejemplo 2 actualizados (8639/8.4KB/3.4KB) |

### 2026-06-13 (sesión 7) — Auditoría anti-slop: CSS scoping, huérfanos, LICENSE

Revisión completa del proyecto buscando relleno IA y cosas sin cerrar. Hallazgos corregidos:

| Cambio | Detalle |
|--------|---------|
| `terminal.css` scopeado | Eliminado reset global (`*`, `html/body`, `body`, `a`) y `:root` del CSS distribuido — restylaba la página anfitriona. Todo scoped a `.gnu-terminal`, vars `--terminal-*` con fallback. `pre.code` y `.kbd` (docs/sin uso) fuera del CDN. Vars base (`--bg`, `--fg`, `--border`, `--accent`, `--radius`, `--bg-softer`) movidas a `page.css` |
| Huérfanos dist eliminados | `demo.min.css`, `demo.min.js(.map)`, `page-styles.min.css` — de un build antiguo, ya no generados ni referenciados pero publicados en CDN |
| LICENSE añadido | GPL-3.0 (texto oficial gnu.org) — el badge del README enlazaba a un 404 |
| `notFound` configurable | Mensaje "Comando no encontrado" ya no hardcodeado: opción `notFound` con placeholder `{cmd}` + atributo `data-not-found`. Documentado en README e index |
| `downloadConfiguration()` eliminado | Descargaba un config JSON que nada podía importar — feature a medias en page.js + botón en index |
| `updatePreview()` simplificado | Fuera `removeAttribute` + `setTimeout(10)` — los selectores de atributo CSS se reevalúan solos |
| terminal.js menores | `applyTheme()` sin `removeAttribute` redundante; click handler con un solo `getBoundingClientRect` |
| Docs corregidos | README: `windows` en data-titlebar, tamaños reales (3.5/9.5/13.3 KB); index: default `data-prompt` → `gnu$`, hero apunta a #demo/#options (antes ambos a #demo), ejemplo install con bytes reales (9705), Nostromo `180924609` (antes NCC-1701, registro de Star Trek) |
| package.json | Scripts `dev` (servía el root, exponía node_modules) y `clean` (rimraf no instalado, roto) eliminados |
| build.js / src | `module.exports` sin consumidor fuera; `src/.gitkeep` innecesario eliminado |

**Cierre:** pusheado a origin/main (`84f235d..e02e6a7`), purge jsDelivr de los 5 archivos dist (verificado: CDN sirve CSS scopeado), demo revisada en local — funciona correctamente.

### 2026-09-24 — `state.md` versionado

Vuelve a git, revisado sin rutas locales ni datos personales. Revierte el untrack de 2026-04-02.

---

## TODO

- [x] Verificar GitHub Pages actualiza correctamente — confirmado 2026-06-13
- [ ] En el futuro: wiki de GitHub para documentación extendida
