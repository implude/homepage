import stylistic from '@stylistic/stylelint-plugin';

/** @type {import('stylelint').Config} */
export default {
	plugins: [stylistic],
	extends: ['stylelint-config-standard-scss', 'stylelint-config-html/svelte', 'stylelint-config-html/astro'],
	ignoreFiles: ['**/dist/**', '**/build/**', '**/.svelte-kit/**', '**/node_modules/**'],
	rules: {
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
		'scss/at-rule-no-unknown': true,
		'scss/dollar-variable-pattern': null,
		'no-empty-source': null,

		'@stylistic/indentation': 'tab',
		'@stylistic/declaration-block-trailing-semicolon': 'always',
		'@stylistic/block-opening-brace-space-before': 'always'
	},
	overrides: [
		{
			files: ['*.svelte', '**/*.svelte', '*.astro', '**/*.astro'],
			customSyntax: 'postcss-html',
			rules: {
				'@stylistic/indentation': 'tab'
			}
		}
	]
};
