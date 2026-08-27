// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', '.angular/**', 'coverage/**', 'test-results/**', 'playwright-report/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // La lib publie sous le préfixe `scrap`, la démo sous `app`.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['scrap', 'app'], style: 'camelCase' },
      ],
      // `scrap-button` se pose en attribut sur <button>/<a> : les deux types
      // de sélecteurs sont légitimes dans cette lib.
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: ['scrap', 'app', 'story'], style: 'kebab-case' },
      ],
      // Les composants sont tous à base de signaux : OnPush est la norme,
      // pas une optimisation ponctuelle.
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Les composants hôtes des tests n'ont pas vocation à respecter
    // les conventions de nommage de sélecteurs.
    files: ['**/*.spec.ts'],
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable', exports: 'writable' },
    },
  },
);
