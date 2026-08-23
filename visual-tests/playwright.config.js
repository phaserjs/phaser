var pw = require('@playwright/test');

module.exports = pw.defineConfig({
    testDir: '.',
    snapshotPathTemplate: '{testDir}/{testFileDir}/{arg}{ext}',
    retries: 0,
    workers: 1,
    projects: [
        {
            name: 'chromium',
            use: {
                ...pw.devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
                deviceScaleFactor: 1,
                launchOptions: {
                    args: ['--use-gl=angle']
                }
            }
        }
    ],
    webServer: {
        command: 'node serve.js',
        port: 8080,
        timeout: 60000,
        reuseExistingServer: !process.env.CI
    },
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0
        }
    }
});
