import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const evidenceRoot = path.resolve(root, '..', 'execution-evidence');

fs.mkdirSync(path.join(root, 'reports', 'html-report'), { recursive: true });
fs.mkdirSync(path.join(root, 'reports', 'test-results'), { recursive: true });
fs.mkdirSync(evidenceRoot, { recursive: true });
