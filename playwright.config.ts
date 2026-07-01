import { defineConfig, devices } from '@playwright/test';
import { getEnvConfig } from './utils/env';

const envConfig = getEnvConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: envConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },

  projects: [
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      testIgnore: /.*-contract\.api\.spec\.ts/,
      use: {
        baseURL: envConfig.apiBaseURL,
      },
    },
    {
      name: 'ui-desktop',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envConfig.uiBaseURL,
      },
    },
    {
      name: 'ui-mobile',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        baseURL: envConfig.uiBaseURL,
      },
    },
  ],
});
