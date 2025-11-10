#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const getBinary = (name) => path.join(
    projectRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? `${name}.cmd` : name,
);

const runCommand = (binary, args, { inheritEnv = true } = {}) => {
    return new Promise((resolve, reject) => {
        const child = spawn(binary, args, {
            stdio: 'inherit',
            env: inheritEnv ? process.env : undefined,
        });

        child.on('close', (code) => {
            if (code === 0 || code === null) {
                resolve();
            } else {
                reject(new Error(`${path.basename(binary)} exited with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
};

const startDev = (args) => {
    const tailwindBinary = getBinary('tailwindcss');
    const viteBinary = getBinary('vite');

    const tailwind = spawn(tailwindBinary, ['-i', './src/input.css', '-o', './public/dist/output.css', '--watch', '--minify'], {
        stdio: 'inherit',
        env: process.env,
    });

    const vite = spawn(viteBinary, ['--clearScreen=false', ...args], {
        stdio: 'inherit',
        env: process.env,
    });

    const shutdown = (code = 0) => {
        if (!tailwind.killed) {
            tailwind.kill('SIGTERM');
        }
        if (!vite.killed) {
            vite.kill('SIGTERM');
        }
        process.exit(code);
    };

    tailwind.on('close', (code) => {
        if (code && code !== 0) {
            console.error('Tailwind CSS watcher exited unexpectedly.');
            shutdown(code);
        }
    });

    tailwind.on('error', (error) => {
        console.error('Failed to start Tailwind CSS watcher:', error);
        shutdown(1);
    });

    vite.on('close', (code) => {
        shutdown(code ?? 0);
    });

    vite.on('error', (error) => {
        console.error('Failed to start Vite using the Next.js compatibility shim:', error);
        shutdown(1);
    });

    for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
        process.on(signal, () => shutdown(0));
    }
};

const build = async (args) => {
    const tailwindBinary = getBinary('tailwindcss');
    const viteBinary = getBinary('vite');
    await runCommand(tailwindBinary, ['-i', './src/input.css', '-o', './public/dist/output.css', '--minify']);
    await runCommand(viteBinary, ['build', ...args]);
};

const preview = (args) => {
    const viteBinary = getBinary('vite');
    return runCommand(viteBinary, ['preview', ...args]);
};

const [, , command = 'dev', ...rest] = process.argv;

(async () => {
    try {
        switch (command) {
            case 'dev':
                startDev(rest);
                break;
            case 'build':
                await build(rest);
                break;
            case 'start':
            case 'preview':
                await preview(rest);
                break;
            default:
                console.error(`Unsupported Next.js shim command: ${command}`);
                console.error('Supported commands: dev, build, start/preview');
                process.exit(1);
        }
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
})();
