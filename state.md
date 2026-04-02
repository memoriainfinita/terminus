# Terminus — state.md

_Última actualización: 2026-04-02_

---

## System

- **Repo:** github.com/memoriainfinita/terminus
- **Branch:** main (31 commits ahead of origin/main, pendiente push)
- **Versión:** v2.0.0
- **Stack:** Vanilla HTML/CSS/JS, sin dependencias
- **Build:** `node ./src/build.js` → `docs/dist/` (~9s)
- **Dev server:** `npm run serve` → `cd docs && python -m http.server 8080`
- **GitHub Pages:** pendiente activar (badge retirado hasta que esté activo)

---

## Services

_Ningún servicio corriendo. Proyecto estático._

---

## Preferences

- Sin emojis en ningún archivo del proyecto
- Commits en inglés: `fix:`, `feat:`, `chore:`, `style:`, `docs:`
- Código: funcional antes que elegante
- Sin slop AI (claims vacíos, textos de relleno, superlativos)
- Idioma de la UI: español (la demo page y los textos de ejemplo)

---

## Patterns

- [build] Siempre `node ./src/build.js` antes de commit — genera minificados en `docs/dist/`. Confirmed 2026-04.
- [cdn] URL correcta: `https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist`. Tag `@main`, no `@latest`. Confirmed 2026-04.
- [terminal-height] Usar `height` fijo (no `min-height`) en terminales embebidos para que el flex viewport scrollee en lugar de crecer. Confirmed 2026-04.
- [autofocus] Auto-focus opt-in vía `data-autofocus` en el componente. Sin el atributo, no hace focus ni scroll al cargar la página. Confirmed 2026-04.
- [grid-layout] `.grid.grid-2` para ejemplos 2×2 (igual peso). `.grid.cols-2` para configurador (1.1fr / .9fr asymétrico). Confirmed 2026-04.

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

---

## TODO

- [ ] Repaso visual final en browser (los 4 ejemplos, configurador, modal snippet)
- [ ] `git push origin main` (31 commits pendientes)
- [ ] Activar GitHub Pages en settings del repo → `/docs` folder
- [ ] Restaurar badge de GitHub Pages en README una vez activo
- [ ] Considerar `data-autofocus` documentado en README/API reference
