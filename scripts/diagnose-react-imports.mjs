#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const allowedExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.config', '.html', '.cjs', '.mjs']);
const skipDirs = new Set(['.git', 'node_modules', 'dist', 'build', '.next', '.vite']);

const findings = [];
let scanned = 0;

function shouldScanFile(fileName) {
  const ext = path.extname(fileName);
  if (allowedExt.has(ext)) return true;
  return (
    fileName.endsWith('.config.js') ||
    fileName.endsWith('.config.ts') ||
    fileName.endsWith('.config.mjs') ||
    fileName.endsWith('.config.cjs')
  );
}

function addFinding(type, file, details = {}) {
  findings.push({ type, file, ...details });
}

function scanFile(relPath, content) {
  const reactImportMatches = content.match(/^\s*import\s+.*?from\s+['"]react['"];?\s*$/gm) ?? [];
  if (reactImportMatches.length > 1) {
    addFinding('duplicate-react-import', relPath, { count: reactImportMatches.length });
  }

  const defaultExportMatches = content.match(/^\s*export\s+default\s+/gm) ?? [];
  if (defaultExportMatches.length > 1) {
    addFinding('multiple-default-exports', relPath, { count: defaultExportMatches.length });
  }

  if (/cdn\.tailwindcss\.com|tailwindcss\.com\//i.test(content)) {
    addFinding('tailwind-cdn-detected', relPath);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
      continue;
    }

    if (!shouldScanFile(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(root, fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    scanned += 1;
    scanFile(relPath, content);
  }
}

walk(root);

const packageJsonPath = path.join(root, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const devScript = packageJson?.scripts?.dev;
  if (!devScript || typeof devScript !== 'string') {
    addFinding('missing-dev-script', 'package.json');
  }
}

const postcssConfigPath = path.join(root, 'postcss.config.cjs');
if (fs.existsSync(postcssConfigPath)) {
  const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  if (!/tailwindcss\s*:/.test(postcssConfig) || !/autoprefixer\s*:/.test(postcssConfig)) {
    addFinding('postcss-missing-tailwind-or-autoprefixer', 'postcss.config.cjs');
  }
} else {
  addFinding('missing-postcss-config', 'postcss.config.cjs');
}

console.log(JSON.stringify({ scannedFiles: scanned, findings }, null, 2));

if (findings.length > 0) {
  process.exitCode = 2;
}
