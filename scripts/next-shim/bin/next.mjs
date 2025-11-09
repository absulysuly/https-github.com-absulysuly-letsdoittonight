#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(moduleDir, '..', '..', 'next-cli.mjs');
await import(cliPath);
