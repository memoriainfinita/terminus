#!/usr/bin/env node

/**
 * TERMINUS - Build System
 * Script para generar archivos minificados y distribución
 * Versión: 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración de paths
const PATHS = {
  src: './src',
  dist: './docs/dist',
  docs: './docs'
};

// Configuración de archivos
const FILES = {
  css: {
    terminal: 'terminal.css',
    demo: 'demo.css'
  },
  js: {
    terminal: 'terminal.js',
    demo: 'demo.js'
  }
};

class TerminusBuild {
  constructor() {
    this.version = this.getVersion();
    console.log(`🔧 TERMINUS BUILD SYSTEM v${this.version}`);
    console.log('=====================================');
  }

  /**
   * Obtiene la versión del package.json
   */
  getVersion() {
    try {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      return pkg.version;
    } catch (e) {
      return '1.0.0';
    }
  }

  /**
   * Crea el directorio dist si no existe
   */
  ensureDistDir() {
    if (!fs.existsSync(PATHS.dist)) {
      fs.mkdirSync(PATHS.dist, { recursive: true });
    }
    console.log('✅ Directorio dist verificado');
  }

  /**
   * Minifica un archivo CSS
   */
  minifyCSS(inputFile, outputFile) {
    const inputPath = path.join(PATHS.src, inputFile);
    const outputPath = path.join(PATHS.dist, outputFile);
    
    try {
      console.log(`🎨 Minificando CSS: ${inputFile} → ${outputFile}`);
      execSync(`npx clean-css-cli ${inputPath} -o ${outputPath}`, { stdio: 'pipe' });
      
      const originalSize = fs.statSync(inputPath).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      console.log(`   📦 ${this.formatBytes(originalSize)} → ${this.formatBytes(minifiedSize)} (-${reduction}%)`);
      return true;
    } catch (error) {
      console.error(`❌ Error minificando ${inputFile}:`, error.message);
      return false;
    }
  }

  /**
   * Minifica un archivo JavaScript
   */
  minifyJS(inputFile, outputFile) {
    const inputPath = path.join(PATHS.src, inputFile);
    const outputPath = path.join(PATHS.dist, outputFile);
    const mapPath = `${outputPath}.map`;
    
    try {
      console.log(`⚡ Minificando JS: ${inputFile} → ${outputFile}`);
      execSync(`npx uglify-js ${inputPath} -o ${outputPath} --source-map "filename='${path.basename(mapPath)}',url='${path.basename(mapPath)}'" -c -m`, { stdio: 'pipe' });
      
      const originalSize = fs.statSync(inputPath).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      console.log(`   📦 ${this.formatBytes(originalSize)} → ${this.formatBytes(minifiedSize)} (-${reduction}%)`);
      return true;
    } catch (error) {
      console.error(`❌ Error minificando ${inputFile}:`, error.message);
      return false;
    }
  }

  /**
   * Crea un bundle combinado CSS + JS del terminal
   */
  createTerminalBundle() {
    console.log('📦 Creando bundle terminal completo...');
    
    const cssContent = fs.readFileSync(path.join(PATHS.dist, 'terminal.min.css'), 'utf8');
    const jsContent = fs.readFileSync(path.join(PATHS.dist, 'terminal.min.js'), 'utf8');
    
    const bundleContent = `/**
 * TERMINUS - Terminal Embebible GNU v${this.version}
 * Bundle completo: CSS + JavaScript
 * Auto-genera terminales con clase 'gnu-terminal'
 * Fecha de build: ${new Date().toISOString()}
 */

// Inyectar CSS automáticamente
(function() {
  const css = \`${cssContent}\`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// JavaScript del terminal
${jsContent}`;

    const bundlePath = path.join(PATHS.dist, 'terminal.bundle.min.js');
    fs.writeFileSync(bundlePath, bundleContent);
    
    const bundleSize = fs.statSync(bundlePath).size;
    console.log(`   📦 Bundle creado: ${this.formatBytes(bundleSize)}`);
  }

  /**
   * Genera snippet de integración actualizado
   */
  generateSnippet() {
    console.log('📋 Generando snippet de integración...');
    
    // URLs para GitHub Pages + jsDelivr (placeholder)
    const cdnBase = 'https://cdn.jsdelivr.net/gh/TU-USUARIO/TERMINUS@latest/docs/dist';
    
    const snippets = {
      separado: `<!-- CSS + JS separados -->
<link rel="stylesheet" href="${cdnBase}/terminal.min.css">
<script src="${cdnBase}/terminal.min.js" defer></script>

<div class="gnu-terminal"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'>
</div>`,
      
      bundle: `<!-- Bundle todo-en-uno -->
<script src="${cdnBase}/terminal.bundle.min.js" defer></script>

<div class="gnu-terminal"
     data-theme="dark"
     data-prompt="gnu$"
     data-commands='{"help":"Lista comandos","about":"Proyecto GNU"}'>
</div>`
    };

    // Guardar snippets
    fs.writeFileSync(path.join(PATHS.dist, 'snippet-separado.html'), snippets.separado);
    fs.writeFileSync(path.join(PATHS.dist, 'snippet-bundle.html'), snippets.bundle);
    
    console.log('   📋 Snippets guardados en docs/dist/');
  }

  /**
   * Crea archivo de metadatos del build
   */
  createBuildInfo() {
    const buildInfo = {
      version: this.version,
      buildDate: new Date().toISOString(),
      files: {
        'terminal.min.css': this.getFileSize('terminal.min.css'),
        'terminal.min.js': this.getFileSize('terminal.min.js'),
        'demo.min.css': this.getFileSize('demo.min.css'),
        'demo.min.js': this.getFileSize('demo.min.js'),
        'terminal.bundle.min.js': this.getFileSize('terminal.bundle.min.js')
      },
      cdn: {
        base: 'https://cdn.jsdelivr.net/gh/TU-USUARIO/TERMINUS@latest/docs/dist',
        terminal_css: 'https://cdn.jsdelivr.net/gh/TU-USUARIO/TERMINUS@latest/docs/dist/terminal.min.css',
        terminal_js: 'https://cdn.jsdelivr.net/gh/TU-USUARIO/TERMINUS@latest/docs/dist/terminal.min.js',
        terminal_bundle: 'https://cdn.jsdelivr.net/gh/TU-USUARIO/TERMINUS@latest/docs/dist/terminal.bundle.min.js'
      }
    };

    fs.writeFileSync(
      path.join(PATHS.dist, 'build-info.json'), 
      JSON.stringify(buildInfo, null, 2)
    );
    
    console.log('📊 Metadatos del build guardados');
  }

  /**
   * Obtiene el tamaño de un archivo en dist
   */
  getFileSize(filename) {
    try {
      const filePath = path.join(PATHS.dist, filename);
      const stats = fs.statSync(filePath);
      return {
        bytes: stats.size,
        formatted: this.formatBytes(stats.size)
      };
    } catch (e) {
      return { bytes: 0, formatted: '0 B' };
    }
  }

  /**
   * Formatea bytes en formato legible
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Ejecuta todo el proceso de build
   */
  async build() {
    const startTime = Date.now();
    
    try {
      // 1. Preparar directorio
      this.ensureDistDir();
      
      // 2. Minificar archivos CSS
      console.log('\n🎨 MINIFICANDO CSS...');
      this.minifyCSS(FILES.css.terminal, 'terminal.min.css');
      this.minifyCSS(FILES.css.demo, 'demo.min.css');
      
      // 3. Minificar archivos JavaScript
      console.log('\n⚡ MINIFICANDO JAVASCRIPT...');
      this.minifyJS(FILES.js.terminal, 'terminal.min.js');
      this.minifyJS(FILES.js.demo, 'demo.min.js');
      
      // 4. Crear bundle
      console.log('\n📦 CREANDO BUNDLES...');
      this.createTerminalBundle();
      
      // 5. Generar snippets
      console.log('\n📋 GENERANDO SNIPPETS...');
      this.generateSnippet();
      
      // 6. Metadatos
      console.log('\n📊 CREANDO METADATOS...');
      this.createBuildInfo();
      
      const duration = Date.now() - startTime;
      console.log(`\n✅ BUILD COMPLETADO en ${duration}ms`);
      console.log('=====================================');
      console.log('📁 Archivos generados en docs/dist/');
      console.log('🚀 Listo para GitHub Pages + jsDelivr');
      
    } catch (error) {
      console.error('\n❌ BUILD FALLÓ:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar build
if (require.main === module) {
  const builder = new TerminusBuild();
  builder.build();
}

module.exports = TerminusBuild;