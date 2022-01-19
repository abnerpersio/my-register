module.exports = {
    'env': {
        'es2021': true,
        'node': true
    },
    'extends': [
        'airbnb-typescript'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 13,
        'sourceType': 'module',
        'project': './tsconfig.json'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'settings': {
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        'typescript': {
          'directory': './tsconfig.json'
        },
        'node': {
          'extensions': ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    'rules': {
      'class-methods-use-this': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          '.js': 'never',
          '.jsx': 'never',
          '.ts': 'never',
          '.tsx': 'never'
        }
      ],
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }]
    }
}
