#!/usr/bin/env node
import { mkdir, writeFile, chmod } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const binDir = path.join(projectRoot, 'node_modules', '.bin');
const unixShimPath = path.join(binDir, 'next');
const windowsShimPath = path.join(binDir, 'next.cmd');

const ensureBinDir = async () => {
    await mkdir(binDir, { recursive: true });
};

const createUnixShim = async () => {
    const script = `#!/usr/bin/env sh
DIR="$(dirname "$0")"
node "$DIR/../../scripts/next-cli.mjs" "$@"
`;
    await writeFile(unixShimPath, script, 'utf8');
    try {
        await chmod(unixShimPath, 0o755);
    } catch (error) {
        if (error && error.code !== 'ENOSYS') {
            throw error;
        }
    }
};

const createWindowsShim = async () => {
    const script = '@ECHO OFF\r\nnode "%~dp0\\..\\..\\scripts\\next-cli.mjs" %*\r\n';
    await writeFile(windowsShimPath, script, 'utf8');
};

const main = async () => {
    await ensureBinDir();
    await Promise.all([createUnixShim(), createWindowsShim()]);
};

main().catch((error) => {
    console.error('Failed to set up the Next.js shim:', error);
    process.exit(1);
});
