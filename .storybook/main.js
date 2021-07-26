const path = require('path')

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    'storybook-css-modules-preset'
  ],

  webpackFinal: async config => {
    config.resolve.extensions.push('.ts', '.tsx', 'js', 'jsx')
    config.resolve.alias = {
      "@src": path.resolve(__dirname, "../src")      // こっちは私の趣味です
    }
    config.resolve.modules = [
      path.resolve(__dirname, '..', 'src'),
      'node_modules',
    ]

    return config
  }
}