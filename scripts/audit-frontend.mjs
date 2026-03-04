#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.config']);

const skipDirs = new Set(['node_modules', '.git', 'dist', 'build']);

const allFiles = [];

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const ext = path.extname(entry.name);
    if (TARGET_EXTENSIONS.has(ext) || entry.name.endsWith('.config.ts') || entry.name.endsWith('.config.js') || entry.name.endsWith('.config.cjs') || entry.name.endsWith('.config.mjs')) {
      allFiles.push(fullPath);
    }
  }
};

walk(ROOT);

const findings = [];

for (const filePath of allFiles) {
  const rel = path.relative(ROOT, filePath);
  if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) continue;
  const source = fs.readFileSync(filePath, 'utf8');

  const reactImports = source.match(/^import\s+.*?from\s+['"]react['"];?$/gm) ?? [];
  if (reactImports.length > 1) {
    findings.push({
      file: rel,
      issue: 'multiple-react-imports',
      count: reactImports.length,
      imports: reactImports,
    });
  }

  const defaultExports = source.match(/\bexport\s+default\b/gm) ?? [];
  if (defaultExports.length > 1) {
    findings.push({
      file: rel,
      issue: 'multiple-default-exports',
      count: defaultExports.length,
    });
  }
}

const result = {
  scannedFiles: allFiles.length,
  codeFilesChecked: allFiles.filter((f) => /\.(ts|tsx|js|jsx)$/.test(f)).length,
  findings,
};

console.log(JSON.stringify(result, null, 2));

if (findings.length > 0) {
  process.exit(1);
}
