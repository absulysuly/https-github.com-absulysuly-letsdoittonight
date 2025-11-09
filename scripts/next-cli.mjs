#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const getViteBinary = () => {
    const vitePath = path.join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
    return vitePath;
};

const runVite = (args) => {
    const viteBinary = getViteBinary();
    const child = spawn(viteBinary, args, {
        stdio: 'inherit',
        env: process.env,
    });

    child.on('close', (code) => {
        process.exit(code ?? 0);
    });

    child.on('error', (error) => {
        console.error('Failed to start Vite using the Next.js compatibility shim:', error);
        process.exit(1);
    });
};

const [, , command = 'dev', ...rest] = process.argv;

switch (command) {
    case 'dev':
        runVite(['--clearScreen=false', ...rest]);
        break;
    case 'build':
        runVite(['build', ...rest]);
        break;
    case 'start':
    case 'preview':
        runVite(['preview', ...rest]);
        break;
    default:
        console.error(`Unsupported Next.js shim command: ${command}`);
        console.error('Supported commands: dev, build, start/preview');
        process.exit(1);
}
