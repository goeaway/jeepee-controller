const path = require("path");

module.exports = (env) => {
    return {
        mode: env.production ? "production" : "development",
        devtool: env.production ? undefined : 'inline-source-map',
        entry: './src/index.tsx',
        output: {
            filename: 'bundle.js',
            path: __dirname + '/dist',
            publicPath: '/output'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                "@config": path.join(__dirname, "src", "config", env.production ? "live": "local"),
                "@src": path.join(__dirname, "src")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: '/node_modules/'
                }
            ]
        },
        devServer: {
            host: "localhost.app.com",
            port: 30,
            contentBase: './wwwroot',
            publicPath: '/output',
            hot: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            historyApiFallback: true,
          }
    };
};