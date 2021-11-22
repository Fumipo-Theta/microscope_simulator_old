const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const version = process.env.npm_package_version;

function readFileIfExists(path, fallbackPath, fallbackStr) {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, "utf-8")
    }

    if (fs.existsSync(fallbackPath)) {
        return fs.readFileSync(fallbackPath, "utf-8")
    }

    return fallbackStr
}

module.exports = (process_env, argv) => {
    const compileEnv = argv.env.COMPILE_ENV === "prod" ? "prod" : "dev"
    const scopinEnv = argv.env.SCOPIN_ENV === "prod"
        ? "prod"
        : argv.env.SCOPIN_ENV === "dev"
            ? "dev"
            : "local"
    const isDeploy = compileEnv === "prod"
    const compileMode = scopinEnv === "production" ? "production" : "development"
    const configJson = process.env.CONFIG_JSON ?? fs.readFileSync(`${__dirname}/config.example.json`, "utf-8")
    const config = JSON.parse(configJson)
    config.compileEnv = compileEnv
    config.scopinEnv = scopinEnv

    console.log("config", config)

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

            new HtmlReplaceWebpackPlugin({
                pattern: '@CUSTOM_META@',
                replacement: readFileIfExists(
                    `${__dirname}/vender/html_fragment/${scopinEnv}/CUSTOM_META.fragment.html`,
                    `${__dirname}/vender/html_fragment/CUSTOM_META.fragment.html`,
                    ""
                )
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@PRE_HOOKS_FRAGMENT@',
                replacement: readFileIfExists(
                    `${__dirname}/vender/html_fragment/${scopinEnv}/PRE_HOOKS.fragment.html`,
                    `${__dirname}/vender/html_fragment/PRE_HOOKS.fragment.html`,
                    ""
                )
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@POST_HOOKS_FRAGMENT@',
                replacement: readFileIfExists(
                    `${__dirname}/vender/html_fragment/${scopinEnv}/POST_HOOKS.fragment.html`,
                    `${__dirname}/vender/html_fragment/POST_HOOKS.fragment.html`,
                    ""
                )
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@SERVICE_WORKER_FRAGMENT@',
                replacement: readFileIfExists(
                    `${__dirname}/vender/html_fragment/${scopinEnv}/SERVICE_WORKER.fragment.html`,
                    `${__dirname}/vender/html_fragment/SERVICE_WORKER.fragment.html`,
                    ""
                )
            }),


            new CopyPlugin({
                patterns: [
                    { from: `${__dirname}/src/css`, to: outputPath + "/css" },
                    { from: `${__dirname}/src/images`, to: outputPath + "/images" },
                    { from: `${__dirname}/src/js/lib`, to: outputPath + "/js/lib" },
                    { from: `${__dirname}/vender/resource/root`, to: outputPath + "/" },
                    { from: `${__dirname}/vender/resource/images`, to: outputPath + "/images" },
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
                        replace: `'${JSON.stringify(config)}'`,
                    }
                },
                {
                    test: /src.*\.(js|ts)$/,
                    exclude: `${__dirname}/webpack.config.js`,
                    loader: 'string-replace-loader',
                    options: {
                        search: "'@DEBUG_LOG_ROTATION@'",
                        replace: isDeploy ? "" : "console.log('rotation: ', rotate)",
                    }
                },
            ]
        },
        resolve: {
            alias: {
                '@src': path.resolve(__dirname, 'src/'),
                '@vender': path.resolve(__dirname, 'vender/')
            },
            extensions: [".ts", ".tsx", ".js", ".json", ".svg", ".css"]
        },
        target: "web"
    }

    const conf_sw = {
        entry: `${__dirname}/vender/resource/sw/service_worker.js`,

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
            alias: {
                '@src': path.resolve(__dirname, 'src/'),
                '@vender': path.resolve(__dirname, 'vender/')
            },
            extensions: [".ts", ".tsx", ".js", ".json", ".svg", ".css"]
        },
        target: "web"
    }
    if (scopinEnv != "prod") {
        //conf_main.devtool = 'eval-source-map'
        conf_make_package.devtool = 'eval-source-map'
    }
    return [conf_main, conf_sw, conf_make_package]
}
