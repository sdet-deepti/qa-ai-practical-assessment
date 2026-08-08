import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const logPath = path.resolve(root, '..', 'execution-evidence', 'terminal-execution.log');
fs.mkdirSync(path.dirname(logPath), { recursive: true });
const logStream = fs.createWriteStream(logPath, { flags: 'w' });

const child = spawn('npx', ['playwright', 'test'], { cwd: root, shell: true });
child.stdout.on('data', (c) => { process.stdout.write(c); logStream.write(c); });
child.stderr.on('data', (c) => { process.stderr.write(c); logStream.write(c); });
child.on('close', (code) => { logStream.end(); process.exit(code ?? 1); });
