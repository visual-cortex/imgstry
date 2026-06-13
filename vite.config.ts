import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    resolve: {
        alias: [
            { find: '~', replacement: resolve(import.meta.dirname, 'source') },
        ],
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'source/index.ts'),
            name: 'imgstry',
            fileName: 'imgstry',
        },
        sourcemap: true,
        target: 'es2020',
    },
});
