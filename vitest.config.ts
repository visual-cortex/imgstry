import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
    resolve: {
        alias: [
            { find: '~', replacement: resolve(import.meta.dirname, 'source') },
            { find: /^test\//, replacement: `${resolve(import.meta.dirname, 'test')}/` },
        ],
    },
    test: {
        include: ['**/test/**/*.test.ts'],
        restoreMocks: true,
        clearMocks: true,
        // canvas runs on the main thread; pin to a single forked worker.
        pool: 'forks',
        fileParallelism: false,
    },
});
