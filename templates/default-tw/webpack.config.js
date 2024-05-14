const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    ...defaultConfig,
    entry: `./src/index.tsx`,
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    resolve: {
        ...defaultConfig.resolve,
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        ...defaultConfig.output,
        filename: "index.js",
        path: path.resolve(__dirname, "build"),
    },
};
