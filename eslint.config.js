import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{
		ignores: ['**/dist/', '**/build/', '**/.svelte-kit/', '**/node_modules/', '**/.astro/']
	},

	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintPluginPrettier,

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'@typescript-eslint/no-empty-interface': 'warn'
		}
	},

	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: eslintPluginAstro.parser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.astro']
			}
		}
	},

	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: eslintPluginSvelte.parser,
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			'svelte/no-unused-svelte-ignore': 'off'
		}
	}
);
