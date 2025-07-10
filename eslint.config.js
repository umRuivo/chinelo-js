import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{
		ignores: [
			'public/**',
			'node_modules/**',
			'export.routes.js'
		]
	},
	js.configs.recommended,

	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'semi': ['error', 'never'],
			'indent': ['error', 'tab'],
			'quotes': ['error', 'single'],
			'no-unused-vars': 'warn',
			'no-console': 'off',
			'no-trailing-spaces': 'error',
			'eol-last': 'error',
			'comma-dangle': ['error', 'never'],
			'space-infix-ops': 'error',
			'space-before-blocks': 'error',
			'space-before-function-paren': ['error', 'never']
		}
	}
])
