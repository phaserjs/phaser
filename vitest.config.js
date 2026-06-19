import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.test.js'],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js'],
        testTimeout: 10000
    }
});
