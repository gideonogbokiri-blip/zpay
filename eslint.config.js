const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', 'jest.setup.js', 'jest.styleMock.js', '.expo/*'],
  },
  {
    rules: {
      'import/namespace': 'off',
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'off',
      'import/no-cycle': 'off',
      'import/named': 'off',
      'import/export': 'off',
    },
  },
]);