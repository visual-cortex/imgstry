import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'coverage/**',
            'node_modules/**',
            'eslint.config.mjs',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    jsdoc.configs['flat/recommended-typescript-error'],
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    sonarjs.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2024,
            },
            parserOptions: {
                project: 'tsconfig.json',
            },
        },
        settings: {
            'import-x/resolver': {
                typescript: true,
            },
        },
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                { accessibility: 'explicit' },
            ],
            '@stylistic/indent': ['error', 4],
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: { delimiter: 'none', requireLast: true },
                    singleline: { delimiter: 'semi', requireLast: false },
                },
            ],
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'forbid',
                    trailingUnderscore: 'forbid',
                },
            ],
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/type-annotation-spacing': 'error',
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            'curly': 'error',
            '@stylistic/eol-last': 'error',
            'eqeqeq': ['error', 'smart'],
            'guard-for-in': 'error',
            '@stylistic/max-len': ['error', { code: 140 }],
            'no-caller': 'error',
            'no-console': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'no-debugger': 'error',
            'no-empty': 'error',
            'no-eval': 'error',
            'no-fallthrough': 'error',
            'no-new-wrappers': 'error',
            'no-redeclare': 'error',
            'no-throw-literal': 'error',
            '@stylistic/no-trailing-spaces': 'error',
            'no-unused-labels': 'error',
            'no-var': 'error',
            'radix': 'error',
            'sonarjs/no-collapsible-if': 'error',
            'sonarjs/no-nested-conditional': 'off',
            'sonarjs/pseudo-random': 'off',
            'sonarjs/public-static-readonly': 'off',
            'sonarjs/no-dead-store': 'off',
            'sonarjs/fixme-tag': 'off',
            'sonarjs/no-nested-assignment': 'off',
            'sonarjs/no-selector-parameter': 'off',
            'sonarjs/deprecation': 'off',
            'sonarjs/void-use': 'off',
            'sonarjs/constructor-for-side-effects': 'off',
            'sonarjs/no-incomplete-assertions': 'off',
            'sonarjs/slow-regex': 'off',
            'sonarjs/no-commented-code': 'off',
            'dot-notation': 'off',
            'no-bitwise': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-empty-function': 'off',
            'no-shadow': 'off',
            'no-underscore-dangle': 'off',
            'no-unused-expressions': 'off',
            'no-unused-vars': 'off',
            'quotes': 'off',
            'semi': 'off',
            '@stylistic/spaced-comment': ['error', 'always', { markers: ['/'] }],
        },
    },
    {
        files: ['test/**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
