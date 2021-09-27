const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './lib/index.js',
    output: {
        filename: 'clientside-reporting-core.min.js',
        path: path.resolve(__dirname, 'lib/worker'),
        library: {
            type: "umd"
        },
    },
    optimization: { 
        minimize: true,
    },
    target: 'web',
    mode: 'production',
    plugins: [
        new CopyPlugin({
        patterns: [
            { from: path.resolve(__dirname, 'src/reporting-worker.js'), to: path.resolve(__dirname, 'lib/worker') },
            { from: path.resolve(__dirname, 'node_modules/workerpool/dist/workerpool.min.js'), to: path.resolve(__dirname, 'lib/worker') },
        ],
        }),
    ],
};