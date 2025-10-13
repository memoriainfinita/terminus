# Terminus — Terminal Embebida GNU

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://memoriainfinita.github.io/TERMINUS/)
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/)
[![License](https://img.shields.io/badge/license-GNU-blue)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-success)]()

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
- **Arquitectura modular limpia** — código optimizado con 22% menos CSS
- **Extensible** — pensado para crecer hacia mini-docs o componentes adicionales
- **Súper ligero** — Solo 4.9 KB CSS + 3.4 KB JS minificados para funcionalidad completa

## Instalación rápida

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

## Demo en Vivo
**[Ver Demo Completa](https://memoriainfinita.github.io/TERMINUS/)**

### Nuevas Características del Demo
- **Configurador Interactivo** — Cambia temas, prompts y comandos en tiempo real
- **4 Temas Visuales** — Matrix, Ocean, Amber y Dark
- **Editor de Comandos** — Agrega, edita y elimina comandos personalizados
- **Generador de Snippet** — Obtén el código HTML listo para usar
- **Preview en Vivo** — Ve los cambios aplicados instantáneamente
- **UI Optimizada** — Diseño limpio y profesional sin elementos redundantes

## Configuración avanzada

### Temas disponibles
- **Matrix** — Verde clásico tipo Matrix
- **Ocean** — Azul profesional
- **Amber** — Ámbar retro terminal
- **Dark** — Oscuro minimalista

### Configuración por data-attributes
| Atributo | Descripción | Valores | Ejemplo |
|-----------|-------------|---------|---------|
| `data-theme` | Tema visual | `matrix`, `ocean`, `amber`, `dark` | `data-theme="matrix"` |
| `data-prompt` | Texto del prompt | Cualquier string | `data-prompt="user@terminus:~$"` |
| `data-welcome` | Mensaje de bienvenida | Texto multilínea | `data-welcome="¡Bienvenido!"` |
| `data-commands` | Comandos simulados (JSON) | Objeto JSON | `data-commands='{"help":"Ayuda"}'` |

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
│   ├── index.html          # Demo page con configurador interactivo
│   ├── page-styles.css     # Sistema de diseño optimizado
│   └── dist/               # Archivos distribuibles
├── src/                    # Código fuente
│   ├── terminal.css        # Estilos del terminal (optimizados)
│   ├── terminal.js         # Lógica del terminal
│   ├── demo.css           # Estilos de la demo (22% menos código)
│   ├── demo.js            # Configurador interactivo
│   └── build.js           # Sistema de build
└── package.json
```

## Archivos de Distribución

### Core Terminal (Listo para producción)
- `terminal.min.css` — 4.9 KB (estilos optimizados -40.8%)
- `terminal.min.js` — 3.4 KB (JavaScript optimizado -46.3%)
- `terminal.bundle.min.js` — 8.7 KB (CSS + JS todo-en-uno)

### Demo Interactivo
- `demo.min.css` — 3.1 KB (configurador -46.2%)
- `demo.min.js` — 11.8 KB (funcionalidad completa -40.1%)
- `page-styles.min.css` — Sistema de diseño unificado

### URLs de CDN (jsDelivr)
```
Última versión:
https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@latest/docs/dist/

Versión específica:
https://cdn.jsdelivr.net/gh/memoriainfinita/TERMINUS@v1.0.0/docs/dist/
```

## Filosofía
Inspirado en la sencillez del software libre: **código claro, integrable y accesible para todos los niveles técnicos**.

## Tecnologías
- HTML5 + CSS3 (sin frameworks)
- Vanilla JavaScript
- GitHub Pages + jsDelivr para distribución
- Build system con clean-css y uglify-js

## Contribuir
1. Haz un fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcion`
3. Haz commit de tus cambios: `git commit -m 'Añadir nueva función'`
4. Envía un pull request

## Desarrollo Asistido por IA
Este proyecto ha sido desarrollado por un **humano** con asistencia de **Claude Sonnet 3.5** (Anthropic). La arquitectura, decisiones de diseño y implementación fueron dirigidas por el desarrollador humano, mientras que Claude proporcionó asistencia en:
- Generación de código base y estructura modular
- **Optimización masiva del CSS** (eliminación de 22% del código)
- **Implementación del configurador interactivo**
- **Debugging y corrección de funcionalidades**
- Sistema de build avanzado
- Documentación técnica completa
- Mejores prácticas de desarrollo web

El resultado es un código **100% funcional**, **altamente optimizado** y **listo para producción**, combinando la creatividad humana con la eficiencia de la asistencia de IA para lograr un componente terminal profesional con configurador en tiempo real.

## Estadísticas del Build (Última Optimización)
- **Reducción CSS**: 40.8% (8.3 KB → 4.9 KB)
- **Reducción JS**: 46.3% (6.3 KB → 3.4 KB)  
- **Optimización Demo**: 22% menos código CSS general
- **Total Core**: 8.3 KB para terminal completo
- **Tiempo de build**: ~6.7 segundos
- **Elementos eliminados**: Sidebar, estadísticas redundantes, botones duplicados
- **Funcionalidad añadida**: Configurador interactivo en tiempo real

## Licencia
Publicado bajo **Licencia GNU** — libre, abierta y comunitaria.

---
**Terminus** © 2025 — Un proyecto GNU minimalista para terminales embebibles.

**Última actualización**: Octubre 2025 — Configurador interactivo, optimización de código y UI profesional

Desarrollado por [@memoriainfinita](https://github.com/memoriainfinita)
