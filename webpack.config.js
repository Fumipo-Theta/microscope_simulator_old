const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin');
const VERSION = process.env.npm_package_version;

const compileEnv = process.env.NODE_ENV == "production" ? "production" : "development"

console.log("Compile env: ", compileEnv)

const outputPath = `${__dirname}/release`

module.exports = [
    {
        entry: `${__dirname}/src/js/index.jsx`,
        output: {
            path: `${outputPath}/js/`,
            filename: "app.js",
        },

        mode: compileEnv,

        devtool: 'cheap-module-eval-source-map',

        plugins: [
            new HtmlWebpackPlugin({
                "template": `${__dirname}/src/html/index.html`,
                "filename": `${outputPath}/index.html`,
            }),

            new HtmlWebpackStringReplacePlugin({
                '@VERSION@': VERSION,
            })
        ],
        devServer: {
            contentBase: __dirname,
            disableHostCheck: true
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts|jsx|tsx)$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.css$/,
                    loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        target: "web"
    },
    {
        entry: `${__dirname}/src/sw/service_worker.js`,

        output: {
            path: `${outputPath}/`,
            filename: "service_worker.js",
        },
        mode: compileEnv,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '@VERSION@',
                        replace: VERSION,
                    }
                }
            ]
        },
    },
    {
        entry: `${__dirname}/src/js/index_make_package.js`,
        output: {
            path: `${outputPath}/js/`,
            filename: "app_make_package.js",
        },

        mode: compileEnv,

        devtool: 'cheap-module-eval-source-map',

        plugins: [
            new HtmlWebpackPlugin({
                "template": `${__dirname}/src/html/make_package.html`,
                "filename": `${outputPath}/make_package.html`,
            }),

            new HtmlWebpackStringReplacePlugin({
                '@VERSION@': VERSION,
            })
        ],
        devServer: {
            contentBase: __dirname,
            disableHostCheck: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    options: {
                        search: '@VERSION@',
                        replace: VERSION,
                    }
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        target: "web"
    }
]
