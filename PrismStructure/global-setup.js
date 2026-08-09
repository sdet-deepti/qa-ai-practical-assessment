import { request } from '@playwright/test';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AuthApi } from './src/api/AuthApi.js';
import { testConfig } from './config/testConfig.js';

const TOKEN_FILE = join(process.cwd(), '.auth-token');

export default async function globalSetup() {
  const ctx = await request.newContext();
  const authApi = new AuthApi(ctx);
  const { email, password } = testConfig.credentials;
  const token = await authApi.login(email, password);
  writeFileSync(TOKEN_FILE, token, 'utf8');
  await ctx.dispose();
}
