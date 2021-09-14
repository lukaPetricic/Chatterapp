const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/src/',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'client', 'dist')
    },
    module: {
        rules: [{
            test: /\.js|\.jsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env']
                }
            }
        }]
    }
};