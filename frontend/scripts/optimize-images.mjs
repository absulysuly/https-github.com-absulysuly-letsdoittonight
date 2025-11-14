#!/usr/bin/env node
import { readdir, mkdir } from 'node:fs/promises';
import { extname, join, basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const imagesDir = join(projectRoot, 'public', 'images');
const outputDir = join(imagesDir, 'optimized');

const supported = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function ensureOutputDir() {
  await mkdir(outputDir, { recursive: true });
}

async function optimize() {
  await ensureOutputDir();
  const files = await readdir(imagesDir, { withFileTypes: true });
  const imageFiles = files.filter((entry) => entry.isFile() && supported.has(extname(entry.name).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log('No hero or banner images detected in public/images. Skipping optimization.');
    return;
  }

  for (const file of imageFiles) {
    const inputPath = join(imagesDir, file.name);
    const nameWithoutExt = basename(file.name, extname(file.name));
    const targetExt = '.webp';
    const outputPath = join(outputDir, `${nameWithoutExt}${targetExt}`);

    await sharp(inputPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`Optimized ${file.name} -> ${outputPath}`);
  }
}

optimize().catch((error) => {
  console.error('Failed to optimize images', error);
  process.exitCode = 1;
});
