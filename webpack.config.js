const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackStringReplacePlugin = require('html-webpack-string-replace-plugin');
const VERSION = process.env.npm_package_version;


module.exports = [{
    entry: `${__dirname}/src/index.js`,
    output: {
        path: `${__dirname}/js`,
        filename: "app.js",
    },
    //mode: "production",
    mode: "development",

    devtool: 'cheap-module-eval-source-map',

    plugins: [
        new HtmlWebpackPlugin({
            "template": "./src/index.html",
            "filename": `${__dirname}/index.html`,
        }),

        new HtmlWebpackStringReplacePlugin({
            '@VERSION@': VERSION,
        })
    ]
},
{
    entry: `${__dirname}/src/sw/service_worker.js`,

    output: {
        path: `${__dirname}/`,
        filename: "service_worker.js",
    },
    mode: "development",
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
}
]
