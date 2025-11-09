#!/usr/bin/env node
import { createServer } from 'vite';

async function run() {
    const [command = 'dev'] = process.argv.slice(2);

    if (command !== 'dev') {
        console.error(`Unsupported command "${command}" passed to next shim. Only "dev" is implemented.`);
        process.exit(1);
    }

    try {
        const server = await createServer({
            root: process.cwd(),
            server: { host: '0.0.0.0' },
        });

        await server.listen();
        server.printUrls();
    } catch (error) {
        console.error('Failed to start development server via next shim.');
        console.error(error instanceof Error ? error.stack : error);
        process.exit(1);
    }
}

run();

