const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: './lib/reporting/functions/index.js',
        combinedSourceValueFilter: './lib/reporting/functions/combinedSourceValueFilter.js',
        combineSources: './lib/reporting/functions/combineSources.js',
        filterSourcesValues: './lib/reporting/functions/filterSourcesValues.js',
        generateReport: './lib/reporting/functions/generateReport.js',
        pipeFromConfig: './lib/reporting/functions/pipeFromConfig.js',
    },
    output: {
        filename: (pathData) => {
            return pathData.chunk.name === 'index' ? 'clientside-reporting-core.full.min.js' : 'functions/[name].min.js';
        },
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