const path = require('path')
const fs = require('fs')

module.exports = (process_env, argv) => {

  const configJson = fs.readFileSync(path.resolve(__dirname, "../config.example.json"), "utf-8")
  console.log("config", configJson)

  return {
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
      config.module.rules.push({
        test: /src.*\.(js|ts)$/,
        exclude: `${__dirname}/webpack.config.js`,
        loader: 'string-replace-loader',
        options: {
          search: "'@CONFIG_JSON@'",
          replace: JSON.stringify(configJson),
        }
      })

      return config
    }
  }
}