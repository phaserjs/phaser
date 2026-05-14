import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.test.{js,ts}'],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js']
    }
});
