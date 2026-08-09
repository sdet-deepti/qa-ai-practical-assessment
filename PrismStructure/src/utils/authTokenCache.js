import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const TOKEN_FILE = join(process.cwd(), '.auth-token');

export function readCachedAuthToken() {
  if (!existsSync(TOKEN_FILE)) return null;
  const token = readFileSync(TOKEN_FILE, 'utf8').trim();
  return token || null;
}
