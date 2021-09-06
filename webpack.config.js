const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const version = process.env.npm_package_version;

module.exports = (process_env, argv) => {
    const compileMode = argv.env.COMPILE_ENV == "prod" ? "production" : "development"
    const configJson = process.env.CONFIG_JSON ?? fs.readFileSync(`${__dirname}/config.example.json`, "utf-8")

    console.log("compile mode: ", compileMode)
    console.log("config", configJson)

    const outputPath = `${__dirname}/release`

    const conf_main = {
        entry: `${__dirname}/src/js/index.tsx`,
        output: {
            path: `${outputPath}/js/`,
            filename: "app.js",
        },

        mode: compileMode,

        plugins: [
            new HtmlWebpackPlugin({
                "template": `${__dirname}/src/html/index.html`,
                "filename": `${outputPath}/index.html`,
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@VERSION@',
                replacement: version,
            }),

            new CopyPlugin({
                patterns: [
                    { from: `${__dirname}/src/root`, to: outputPath + "/" },
                    { from: `${__dirname}/src/css`, to: outputPath + "/css" },
                    { from: `${__dirname}/src/images`, to: outputPath + "/images" },
                    { from: `${__dirname}/src/js/lib`, to: outputPath + "/js/lib" },
                ]
            })
        ],
        devServer: {
            contentBase: __dirname,
            compress: true,
            port: 8080,
            disableHostCheck: true
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts|jsx|tsx)$/,
                    use: 'ts-loader'
                },
                {
                    test: /module\.css$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: { url: false, modules: true }
                        }
                    ]
                },
                {
                    test: /src.*\.(js|ts)$/,
                    exclude: `${__dirname}/webpack.config.js`,
                    loader: 'string-replace-loader',
                    options: {
                        search: "'@CONFIG_JSON@'",
                        replace: JSON.stringify(configJson),
                    }
                }
            ]
        },
        resolve: {
            alias: { '@src': path.resolve(__dirname, 'src/') },
            extensions: [".ts", ".tsx", ".js", ".json", ".svg", ".css"]
        },
        target: "web"
    }

    const conf_sw = {
        entry: `${__dirname}/src/sw/service_worker.js`,

        output: {
            path: `${outputPath}/`,
            filename: "service_worker.js",
        },
        mode: compileMode,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '@VERSION@',
                        replace: version,
                    }
                }
            ]
        },
    }

    const conf_make_package = {
        entry: `${__dirname}/src/js/index_make_package.ts`,
        output: {
            path: `${outputPath}/js/`,
            filename: "app_make_package.js",
        },

        mode: compileMode,

        plugins: [
            new HtmlWebpackPlugin({
                "template": `${__dirname}/src/html/make_package.html`,
                "filename": `${outputPath}/make_package.html`,
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@VERSION@',
                replacement: version,
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(js|ts|jsx|tsx)$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '@VERSION@',
                        replace: version,
                    }
                },
                {
                    test: /src.*\.(js|ts)$/,
                    exclude: `${__dirname}/webpack.config.js`,
                    loader: 'string-replace-loader',
                    options: {
                        search: "'@CONFIG_JSON@'",
                        replace: JSON.stringify(configJson),
                    }
                },
            ]
        },
        resolve: {
            alias: { '@src': path.resolve(__dirname, 'src/') },
            extensions: [".ts", ".tsx", ".js", ".json", ".svg", ".css"]
        },
        target: "web"
    }
    if (compileMode != "production") {
        //conf_main.devtool = 'eval-source-map'
        conf_make_package.devtool = 'eval-source-map'
    }
    return [conf_main, conf_sw, conf_make_package]
}
