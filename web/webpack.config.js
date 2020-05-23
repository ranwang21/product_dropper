const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    resolve: {
        alias: {
            component: path.resolve(__dirname, 'src/component/'),
            container: path.resolve(__dirname, 'src/container/'),
            service: path.resolve(__dirname, 'src/service/')
        }
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [{ loader: 'html-loader', options: { minimize: false } }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html',
            filename: './index.html'
        })
    ]

}
