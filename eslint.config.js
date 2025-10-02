// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // Ajustes de lint para scripts Node e utilitários fora do app React Native
  {
    files: [
      'scripts/**/*.js',
      'xcode-cloud-web-api/**/*.js',
      'google-play-console/**/*.js',
      'ios-build-check.js',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        __dirname: true,
        Buffer: true,
        process: true,
        module: true,
        require: true,
      },
    },
    // Flat config não usa `env`, então habilitamos globals manualmente acima.
    rules: {
      // Permitir tratar erros capturados com _error sem acusar unused
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'all', caughtErrorsIgnorePattern: '^_' }],
    },
  },
]);
