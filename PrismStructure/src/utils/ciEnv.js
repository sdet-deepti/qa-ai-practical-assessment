/** True on GitHub Actions and when CI=true is set locally. */
export const isCiEnv = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);
