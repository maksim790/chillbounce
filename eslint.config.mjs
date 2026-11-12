import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default defineConfig(
	globalIgnores([
		'**/node_modules/**',
		'**/.pnpm-store/**',
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
	{
		files: ['apps/frontend/*/src/**/*.tsx'],
		extends: [
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
	},
	prettier,
);
