# Terminus — Terminal Embebida GNU

## 📜 Descripción
**Terminus** es una terminal embebible para la web, creada bajo el espíritu del software libre (GNU). Su objetivo es ofrecer una interfaz ligera, modular y sin dependencias que pueda integrarse en cualquier página HTML con un simple snippet.

## 🚀 Características principales
- **HTML/CSS/JS puro** — sin frameworks ni APIs externas.
- **Modo auto-init** — se activa automáticamente al detectar un elemento con la clase `gnu-terminal`.
- **Diseño oscuro elegante** con acento verde y tipografía *Inter* + *IBM Plex Mono*.
- **Microinteracciones técnicas** (cursor parpadeante, escritura gradual, animaciones suaves).
- **Responsive** y compatible con modo claro/oscuro.
- **Extensible** — pensado para crecer hacia mini-docs o componentes adicionales.

## 🧩 Integración
Agrega este snippet en tu HTML:
```html
<link rel="stylesheet" href="https://cdn.example.com/terminal.min.css">
<script src="https://cdn.example.com/terminal.min.js" defer></script>

<div class="gnu-terminal"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'></div>
```

## ⚙️ Atributos de configuración
| Atributo | Descripción | Valores |
|-----------|-------------|----------|
| `data-theme` | Tema visual | `dark`, `light`, `auto` |
| `data-prompt` | Texto del prompt | Ej. `gnu$` |
| `data-commands` | Comandos simulados (JSON) | Ej. `{ "help": "Lista de comandos" }` |

## 🧠 Filosofía
Inspirado en la sencillez del software libre: **código claro, integrable y accesible para todos los niveles técnicos**.

## 📦 Estructura del proyecto
```
/public
  /dist
    terminal.min.css
    terminal.min.js
index.html (usa el mismo bundle para la demo y el snippet)
```

## 🔧 Tecnologías
- HTML5 + CSS3 (sin frameworks)
- Vanilla JavaScript
- GitHub Pages + jsDelivr para distribución

## 🧑‍💻 Contribuir
1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix: `git checkout -b feature/nueva-funcion`.
3. Haz commit de tus cambios: `git commit -m 'Añadir nueva función'`.
4. Envía un pull request.

## 📄 Licencia
Publicado bajo **Licencia GNU** — libre, abierta y comunitaria.

---
**Terminus** © 2025 — Un proyecto GNU minimalista para terminales embebibles.
