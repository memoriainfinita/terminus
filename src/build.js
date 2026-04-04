#!/usr/bin/env node

/**
 * TERMINUS - Build System
 * Build script for minification and distribution
 * Version: 2.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PATHS = {
  src: './src',
  dist: './docs/dist',
  docs: './docs'
};

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/memoriainfinita/terminus@main/docs/dist';

class TerminusBuild {
  constructor() {
    this.version = this.getVersion();
    console.log(`TERMINUS BUILD SYSTEM v${this.version}`);
    console.log('=====================================');
  }

  getVersion() {
    try {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      return pkg.version;
    } catch (e) {
      return '2.0.0';
    }
  }

  ensureDistDir() {
    if (!fs.existsSync(PATHS.dist)) {
      fs.mkdirSync(PATHS.dist, { recursive: true });
    }
    console.log('dist directory ready');
  }

  minifyCSS(inputPath, outputFile) {
    const outputPath = path.join(PATHS.dist, outputFile);
    try {
      console.log(`CSS: ${path.basename(inputPath)} -> ${outputFile}`);
      execSync(`npx clean-css-cli ${inputPath} -o ${outputPath}`, { stdio: 'pipe' });
      const originalSize = fs.statSync(inputPath).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      console.log(`   ${this.formatBytes(originalSize)} -> ${this.formatBytes(minifiedSize)} (-${reduction}%)`);
      return true;
    } catch (error) {
      console.error(`ERROR minifying ${path.basename(inputPath)}:`, error.message);
      return false;
    }
  }

  minifyJS(inputPath, outputFile) {
    const outputPath = path.join(PATHS.dist, outputFile);
    const mapPath = `${outputPath}.map`;
    try {
      console.log(`JS: ${path.basename(inputPath)} -> ${outputFile}`);
      execSync(`npx uglify-js ${inputPath} -o ${outputPath} --source-map "filename='${path.basename(mapPath)}',url='${path.basename(mapPath)}'" -c -m`, { stdio: 'pipe' });
      const originalSize = fs.statSync(inputPath).size;
      const minifiedSize = fs.statSync(outputPath).size;
      const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      console.log(`   ${this.formatBytes(originalSize)} -> ${this.formatBytes(minifiedSize)} (-${reduction}%)`);
      return true;
    } catch (error) {
      console.error(`ERROR minifying ${path.basename(inputPath)}:`, error.message);
      return false;
    }
  }

  createTerminalBundle() {
    console.log('Bundle: terminal.bundle.min.js...');
    const cssContent = fs.readFileSync(path.join(PATHS.dist, 'terminal.min.css'), 'utf8');
    const jsContent = fs.readFileSync(path.join(PATHS.dist, 'terminal.min.js'), 'utf8');
    const bundleContent = `/**\n * TERMINUS - Embeddable Terminal Component v${this.version}\n * Full bundle: CSS + JavaScript\n * Auto-initializes elements with class 'gnu-terminal'\n */\n\n// Auto-inject CSS\n(function() {\n  const css = \`${cssContent}\`;\n  const style = document.createElement('style');\n  style.textContent = css;\n  document.head.appendChild(style);\n})();\n\n// Terminal JavaScript\n${jsContent}`;
    const bundlePath = path.join(PATHS.dist, 'terminal.bundle.min.js');
    fs.writeFileSync(bundlePath, bundleContent);
    const bundleSize = fs.statSync(bundlePath).size;
    console.log(`   Bundle: ${this.formatBytes(bundleSize)}`);
  }

  createBuildInfo() {
    const buildInfo = {
      version: this.version,
      files: {
        'terminal.min.css': this.getFileSize('terminal.min.css'),
        'terminal.min.js': this.getFileSize('terminal.min.js'),
        'page.min.css': this.getFileSize('page.min.css'),
        'page.min.js': this.getFileSize('page.min.js'),
        'terminal.bundle.min.js': this.getFileSize('terminal.bundle.min.js')
      },
      cdn: {
        base: CDN_BASE,
        terminal_css: `${CDN_BASE}/terminal.min.css`,
        terminal_js: `${CDN_BASE}/terminal.min.js`,
        terminal_bundle: `${CDN_BASE}/terminal.bundle.min.js`
      }
    };
    fs.writeFileSync(path.join(PATHS.dist, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
    console.log('Build info saved');
  }

  getFileSize(filename) {
    try {
      const filePath = path.join(PATHS.dist, filename);
      const stats = fs.statSync(filePath);
      return { bytes: stats.size, formatted: this.formatBytes(stats.size) };
    } catch (e) {
      return { bytes: 0, formatted: '0 B' };
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async build() {
    const startTime = Date.now();
    try {
      this.ensureDistDir();
      console.log('\nCSS...');
      this.minifyCSS(path.join(PATHS.src, 'terminal.css'), 'terminal.min.css');
      this.minifyCSS(path.join(PATHS.docs, 'page.css'), 'page.min.css');
      console.log('\nJS...');
      this.minifyJS(path.join(PATHS.src, 'terminal.js'), 'terminal.min.js');
      this.minifyJS(path.join(PATHS.docs, 'page.js'), 'page.min.js');
      console.log('\nBundles...');
      this.createTerminalBundle();
      console.log('\nBuild info...');
      this.createBuildInfo();
      const duration = Date.now() - startTime;
      console.log(`\nBUILD OK in ${duration}ms`);
      console.log('=====================================');
      console.log('Output files in docs/dist/');
    } catch (error) {
      console.error('\nBUILD FAILED:', error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const builder = new TerminusBuild();
  builder.build();
}

module.exports = TerminusBuild;
