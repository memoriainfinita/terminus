# Terminus — Terminal Embebida GNU 🐃

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://memoriainfinita.github.io/TERMINUS/)
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/)
[![License](https://img.shields.io/badge/license-GNU-blue)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-success)]()

## 📜 Descripción
**Terminus** es una terminal embebible para la web, creada bajo el espíritu del software libre (GNU). Su objetivo es ofrecer una interfaz ligera, modular y sin dependencias que pueda integrarse en cualquier página HTML con un simple snippet.

## 🚀 Características principales
- **HTML/CSS/JS puro** — sin frameworks ni APIs externas
- **Modo auto-init** — se activa automáticamente al detectar un elemento con la clase `gnu-terminal`
- **Diseño oscuro elegante** con acento verde y tipografía *Inter* + *IBM Plex Mono*
- **Microinteracciones técnicas** (cursor parpadeante, escritura gradual, animaciones suaves)
- **Responsive** y compatible con modo claro/oscuro
- **Extensible** — pensado para crecer hacia mini-docs o componentes adicionales
- **Súper ligero** — Solo 5.1 KB minificado para funcionalidad completa

## ⚡ Instalación rápida

### Opción 1: CSS + JS separados
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/terminal.min.css">
<script src="https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/terminal.min.js" defer></script>

<div class="gnu-terminal"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'></div>
```

### Opción 2: Bundle todo-en-uno
```html
<script src="https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/terminal.bundle.min.js" defer></script>

<div class="gnu-terminal"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'></div>
```

## 🎮 Demo en Vivo
👉 **[Ver Demo Completa](https://memoriainfinita.github.io/TERMINUS/)**

## ⚙️ Configuración por data-attributes
| Atributo | Descripción | Valores | Ejemplo |
|-----------|-------------|---------|---------|
| `data-theme` | Tema visual | `dark`, `light`, `auto` | `data-theme="dark"` |
| `data-prompt` | Texto del prompt | Cualquier string | `data-prompt="user@host$"` |
| `data-commands` | Comandos simulados (JSON) | Objeto JSON | `data-commands='{"help":"Ayuda"}'` |

### Ejemplo avanzado:
```html
<div class="gnu-terminal"
     data-theme="auto"
     data-prompt="servidor@produccion$"
     data-commands='{
       "help": "Comandos disponibles: status, deploy, logs",
       "status": "✅ Sistema operativo: OK",
       "deploy": "🚀 Desplegando aplicación...",
       "logs": "📋 Mostrando logs recientes..."
     }'>
</div>
```

## 🛠️ Desarrollo

### Clonar repositorio
```bash
git clone https://github.com/memoriainfinita/TERMINUS.git
cd TERMINUS
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
TERMINUS/
├── docs/                    # GitHub Pages
│   ├── index.html          # Demo page
│   └── dist/               # Archivos distribuibles
├── src/                    # Código fuente
│   ├── terminal.css        # Estilos del terminal
│   ├── terminal.js         # Lógica del terminal
│   ├── demo.css           # Estilos de la demo
│   ├── demo.js            # Interacciones demo
│   └── build.js           # Sistema de build
└── package.json
```

## 📦 Archivos de Distribución

### Core Terminal (Listo para producción)
- `terminal.min.css` — 2.2 KB (estilos minificados)
- `terminal.min.js` — 2.9 KB (JavaScript minificado)
- `terminal.bundle.min.js` — 5.5 KB (CSS + JS todo-en-uno)

### URLs de CDN (jsDelivr)
```
Última versión:
https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/

Versión específica:
https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@v1.0.0/docs/dist/
```

## 🧠 Filosofía
Inspirado en la sencillez del software libre: **código claro, integrable y accesible para todos los niveles técnicos**.

## 🔧 Tecnologías
- HTML5 + CSS3 (sin frameworks)
- Vanilla JavaScript
- GitHub Pages + jsDelivr para distribución
- Build system con clean-css y uglify-js

## 🧑‍💻 Contribuir
1. Haz un fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcion`
3. Haz commit de tus cambios: `git commit -m 'Añadir nueva función'`
4. Envía un pull request

## 🤖 Desarrollo Asistido por IA
Este proyecto ha sido desarrollado por un **humano** con asistencia de **Claude Sonnet 3.5** (Anthropic). La arquitectura, decisiones de diseño y implementación fueron dirigidas por el desarrollador humano, mientras que Claude proporcionó asistencia en:
- Generación de código base y estructura modular
- Optimización del sistema de build
- Documentación técnica
- Mejores prácticas de desarrollo web

El resultado es un código **100% funcional**, **bien estructurado** y **listo para producción**, combinando la creatividad humana con la eficiencia de la asistencia de IA.

## 📊 Estadísticas del Build
- **Reducción CSS**: 43.6% (3.8 KB → 2.2 KB)
- **Reducción JS**: 42.5% (5.1 KB → 2.9 KB)  
- **Total minificado**: 5.1 KB para terminal completo
- **Tiempo de build**: ~6 segundos

## 📄 Licencia
Publicado bajo **Licencia GNU** — libre, abierta y comunitaria.

---
**Terminus** © 2025 — Un proyecto GNU minimalista para terminales embebibles.

Desarrollado por [@memoriainfinita](https://github.com/memoriainfinita)
