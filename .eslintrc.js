module.exports = {
  settings: {
    react: {
      version: '15.0'
    }
  },
  env: {
    jest: true
  },
  parser: 'babel-eslint',
  extends: [
    'standard',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
    'plugin:react/recommended'
  ],
  plugins: ['react']
}
