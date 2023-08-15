import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: [
            { find: '~', replacement: resolve(__dirname, 'source') },
        ],
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'source/index.ts'),
            name: 'imgstry',
            fileName: 'imgstry',
        },
    },
});
