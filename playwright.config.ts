import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on',
  },
  projects: [
    {
      name: 'project1',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'test1',
      },
    },
    {
      name: 'project2',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'test2',
      },
    },
  ],
});