#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const [, , commandFromCli, ...commandArgs] = process.argv;
const command = commandFromCli ?? 'dev';

const logShimNotice = (mode) => {
  const heading = mode === 'dev' ? 'development server' : `${mode} mode`;
  console.info(`⚠️  Next.js not detected. Using Vite ${heading} via shim.`);
};

const run = (executablePath, args) => {
  const child = spawn(executablePath, args, { stdio: 'inherit', env: process.env });
  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
};

const viteBin = () => {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(moduleDir, '..', 'node_modules', 'vite', 'bin', 'vite.js');
};

switch (command) {
  case 'dev':
    logShimNotice(command);
    run(process.execPath, [viteBin(), ...commandArgs]);
    break;
  case 'build':
    logShimNotice(command);
    run(process.execPath, [viteBin(), 'build', ...commandArgs]);
    break;
  case 'preview':
    logShimNotice(command);
    run(process.execPath, [viteBin(), 'preview', ...commandArgs]);
    break;
  case 'start':
    logShimNotice(command);
    run(process.execPath, [viteBin(), 'preview', ...commandArgs]);
    break;
  default:
    console.error(`Unsupported next command: ${command}`);
    process.exit(1);
}
