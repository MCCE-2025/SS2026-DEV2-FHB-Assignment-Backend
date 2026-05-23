import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import nodePlugin from 'eslint-plugin-n'
import securityPlugin from 'eslint-plugin-security'

// Best-practice rules applied across all JS files.
const bestPracticeRules = {
  eqeqeq: ['error', 'always'],
  'no-var': 'error',
  'prefer-const': 'error',
  curly: ['error', 'all'],
  'no-implicit-globals': 'error',
  'no-throw-literal': 'error',
  'no-return-await': 'error',
  'no-unused-expressions': 'error',
  'no-console': ['warn', { allow: ['log', 'info', 'warn', 'error'] }],
}

// Style rules matching the existing index.js conventions:
// single quotes, no semicolons, 2-space indent, Unix line endings.
const styleRules = {
  '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
  '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'always' }],
  '@stylistic/semi': ['error', 'never'],
  '@stylistic/eol-last': ['error', 'always'],
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/comma-dangle': ['error', 'only-multiline'],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/arrow-spacing': 'error',
  '@stylistic/space-before-blocks': 'error',
  '@stylistic/keyword-spacing': 'error',
}

export default defineConfig([
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },

  // Security plugin (recommended set) — applies to all JS.
  securityPlugin.configs.recommended,

  // ESM config files.
  {
    files: ['**/*.mjs'],
    extends: [js.configs.recommended],
    plugins: {
      '@stylistic': stylistic,
      n: nodePlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      ...nodePlugin.configs['flat/recommended-module'].rules,
      ...bestPracticeRules,
      ...styleRules,
    },
  },

  // CommonJS application code.
  {
    files: ['**/*.{js,cjs}'],
    extends: [js.configs.recommended],
    plugins: {
      '@stylistic': stylistic,
      n: nodePlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      ...nodePlugin.configs['flat/recommended-script'].rules,
      ...bestPracticeRules,
      ...styleRules,
    },
  },

  // ESLint flat-config files import dev-only packages; that's expected.
  {
    files: ['eslint.config.{js,mjs,cjs}'],
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },

  // Test files import dev-only packages (vitest, supertest).
  {
    files: ['tests/**/*.js', 'vitest.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'n/no-unpublished-require': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
])
