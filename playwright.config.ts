import { defineConfig, devices } from '@playwright/test';
import { getEnvConfig } from './utils/env';

const envConfig = getEnvConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: envConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: envConfig.apiBaseURL,
      },
    },
    {
      name: 'chromium',
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
