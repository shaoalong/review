// https://eslint.org/docs/user-guide/configuring

console.log('eslintrc');
module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    env: {
      browser: true,
    },
    extends: 'airbnb-base',
    // required to lint *.vue files
    plugins: [
      'html'
    ],
    // check if imports actually resolve
    settings: {
      'import/resolver': {
        webpack: {
          config: 'build/webpack.base.config.js'
        }
      }
    },
    // add your custom rules here
    rules: {
      // don't require .vue extension when importing
      'import/extensions': ['error', 'always', {
        js: 'never',
        vue: 'never'
      }],
      // allow optionalDependencies
      'import/no-extraneous-dependencies': ['error', {
        optionalDependencies: ['test/unit/index.js']
      }],
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0 ,
      "no-console": "off",
      "no-underscore-dangle": "off",
      "linebreak-style": "off",
    },
    "globals": {
      "document": false,
      "window": false,
      "echarts": true
    }
  }
