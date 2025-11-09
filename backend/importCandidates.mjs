import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = resolve(__dirname, 'data', 'MASTER_CANDIDATES_7769.csv');

/**
 * Shared mutable candidate store populated from the CSV import.
 * @type {Array<Record<string, any>>}
 */
export const candidates = [];

/**
 * Parses a single CSV row respecting quoted fields.
 * @param {string} line
 * @param {string[]} headers
 * @returns {Record<string, string> | null}
 */
function parseCsvRow(line, headers) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    if (values.length !== headers.length) {
        return null;
    }

    return headers.reduce((acc, header, index) => {
        acc[header] = values[index];
        return acc;
    }, /** @type {Record<string, string>} */ ({}));
}

/**
 * Imports candidate data from the CSV file and populates the shared store.
 */
export async function importCandidates() {
    const fileContents = await readFile(DATA_PATH, 'utf8');
    const [headerLine, ...dataLines] = fileContents
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);

    if (!headerLine) {
        throw new Error('Candidate CSV is empty or missing headers.');
    }

    const headers = headerLine.split(',');

    const parsedCandidates = dataLines
        .map((line) => parseCsvRow(line, headers))
        .filter((row) => row !== null);

    candidates.splice(0, candidates.length, ...parsedCandidates);

    return candidates;
}

export default importCandidates;
