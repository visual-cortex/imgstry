// vitest 4 moved poolOptions out from under `test`; the type bundle still
// surfaces the old shape, so the `forks` block requires the relaxed
// `defineConfig` accessor exported by vitest itself.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: [
            { find: '~', replacement: resolve(__dirname, 'source') },
            { find: /^test\//, replacement: `${resolve(__dirname, 'test')}/` },
        ],
    },
    // canvas runs on the main thread; use the single-threaded forks pool
    forks: {
        singleFork: true,
    },
    test: {
        include: ['**/test/**/*.test.ts'],
        restoreMocks: true,
        clearMocks: true,
        pool: 'forks',
    },
} as Parameters<typeof defineConfig>[0]);
