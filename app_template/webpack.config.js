const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const version = process.env.npm_package_version;

const coreDir = path.resolve(__dirname, '_src/')
const venderDir = path.resolve(__dirname, 'vender/')

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
    const runtimeEnv = argv.env.RUNTIME_ENV === "prod"
        ? "prod"
        : argv.env.RUNTIME_ENV === "dev"
            ? "dev"
            : "local"
    const isDeploy = compileEnv === "prod"
    const compileMode = runtimeEnv === "prod" ? "production" : "development"
    const configJson = process.env.CONFIG_JSON ?? fs.readFileSync(`${__dirname}/config.example.json`, "utf-8")
    const config = JSON.parse(configJson)
    config.compileEnv = compileEnv
    config.runtimeEnv = runtimeEnv

    console.log("config", config)

    const outputPath = `${__dirname}/release`

    const conf_main = {
        entry: `${coreDir}/js/index.tsx`,
        output: {
            path: `${outputPath}/js/`,
            filename: "app.js",
        },

        mode: compileMode,

        plugins: [
            new HtmlWebpackPlugin({
                "template": `${coreDir}/html/index.html`,
                "filename": `${outputPath}/index.html`,
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@VERSION@',
                replacement: version,
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@CUSTOM_META@',
                replacement: readFileIfExists(
                    `${venderDir}/html_fragment/${runtimeEnv}/CUSTOM_META.fragment.html`,
                    `${venderDir}/html_fragment/CUSTOM_META.fragment.html`,
                    ""
                )
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@PRE_HOOKS_FRAGMENT@',
                replacement: readFileIfExists(
                    `${venderDir}/html_fragment/${runtimeEnv}/PRE_HOOKS.fragment.html`,
                    `${venderDir}/html_fragment/PRE_HOOKS.fragment.html`,
                    ""
                )
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@POST_HOOKS_FRAGMENT@',
                replacement: readFileIfExists(
                    `${venderDir}/html_fragment/${runtimeEnv}/POST_HOOKS.fragment.html`,
                    `${venderDir}/html_fragment/POST_HOOKS.fragment.html`,
                    ""
                )
            }),

            new HtmlReplaceWebpackPlugin({
                pattern: '@SERVICE_WORKER_FRAGMENT@',
                replacement: readFileIfExists(
                    `${venderDir}/html_fragment/${runtimeEnv}/SERVICE_WORKER.fragment.html`,
                    `${venderDir}/html_fragment/SERVICE_WORKER.fragment.html`,
                    ""
                )
            }),


            new CopyPlugin({
                patterns: [
                    { from: `${coreDir}/css`, to: outputPath + "/css" },
                    { from: `${coreDir}/images`, to: outputPath + "/images" },
                    { from: `${coreDir}/js/lib`, to: outputPath + "/js/lib" },
                    { from: `${venderDir}/resource/root`, to: outputPath + "/" },
                    { from: `${venderDir}/resource/images`, to: outputPath + "/images" },
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
                '@src': coreDir,
                '@vender': venderDir
            },
            extensions: [".ts", ".tsx", ".js", ".json", ".svg", ".css"]
        },
        target: "web"
    }

    const conf_sw = {
        entry: `${venderDir}/resource/sw/service_worker.js`,

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
        entry: `${coreDir}/js/index_make_package.ts`,
        output: {
            path: `${outputPath}/js/`,
            filename: "app_make_package.js",
        },

        mode: compileMode,

        plugins: [
            new HtmlWebpackPlugin({
                "template": `${coreDir}/html/make_package.html`,
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
                '@src': coreDir,
                '@vender': venderDir
            },
            extensions: [".ts", ".tsx", ".js", ".json", ".svg", ".css"]
        },
        target: "web"
    }
    if (runtimeEnv != "prod") {
        //conf_main.devtool = 'eval-source-map'
        conf_make_package.devtool = 'eval-source-map'
    }
    return [conf_main, conf_sw, conf_make_package]
}
