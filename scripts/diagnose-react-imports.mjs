#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const allowedExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.config']);
const skipDirs = new Set(['.git', 'node_modules', 'dist']);

const findings = [];
let scanned = 0;

function shouldScanFile(fileName) {
  const ext = path.extname(fileName);
  if (allowedExt.has(ext)) return true;
  return fileName.endsWith('.config.js') || fileName.endsWith('.config.ts') || fileName.endsWith('.config.mjs');
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

    const reactImportMatches = content.match(/^\s*import\s+.*?from\s+['"]react['"];?\s*$/gm) ?? [];
    if (reactImportMatches.length > 1) {
      findings.push({ type: 'duplicate-react-import', file: relPath, count: reactImportMatches.length });
    }

    const defaultExportMatches = content.match(/^\s*export\s+default\s+/gm) ?? [];
    if (defaultExportMatches.length > 1) {
      findings.push({ type: 'multiple-default-exports', file: relPath, count: defaultExportMatches.length });
    }
  }
}

walk(root);

console.log(JSON.stringify({ scannedFiles: scanned, findings }, null, 2));

if (findings.length > 0) {
  process.exitCode = 2;
}
