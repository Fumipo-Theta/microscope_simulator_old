// ファイル指定関連
const fs = require('fs')
const path = require('path')

// docgen関連パッケージ読み込み
const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin')

// ディレクトリ指定用関数
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                include: resolveApp('src'),
                options: {
                    configFile: `${resolveApp(
                        'internals/tsconfig'
                    )}/tsconfig.storybook.json`,
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
    },
    plugins: [new TSDocgenPlugin()],
}