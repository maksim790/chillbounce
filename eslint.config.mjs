import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.vite/**',
    '**/.cache/**',
  ]),
  {
    files: ['**/*.{js,cjs,mjs,jsx}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.{ts,cts,mts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  prettier,
);
