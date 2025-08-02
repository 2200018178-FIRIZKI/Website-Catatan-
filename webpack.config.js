const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point aplikasi
  output: {
    path: path.resolve(__dirname, 'dist'), // Output ke folder dist
    filename: 'bundle.js', // Nama file output
    clean: true, // Membersihkan folder dist sebelum build baru
    publicPath: '/', // Public path untuk assets
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // Folder untuk serve file
    },
    open: true, // Membuka browser otomatis
    hot: true, // Hot Module Replacement (HMR)
    port: 3000, // Port dev server
    historyApiFallback: true, // Support untuk SPA routing
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Mendukung file JavaScript
        exclude: /node_modules/, // Mengecualikan node_modules
        use: {
          loader: 'babel-loader', // Menggunakan Babel untuk transpiling
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Mendukung file CSS
        use: ['style-loader', 'css-loader'], // Loader untuk CSS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Mendukung file gambar
        type: 'asset/resource', // Untuk output gambar sebagai asset
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'), // Template HTML
      filename: 'index.html', // Output HTML
      inject: 'body', // Inject scripts at body
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.css'], // Resolusi default file
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  mode: 'development', // Mode pengembangan
  devtool: 'eval-source-map', // Source maps untuk debugging
};






