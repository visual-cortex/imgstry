import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: [
            { find: '~', replacement: resolve(__dirname, 'source') },
        ],
    },
    test: {
        include: ['**/test/**/*.test.ts'],
        // @threads: disable worker threads so that canvas runs in main thread
        threads: false,
    },
});
