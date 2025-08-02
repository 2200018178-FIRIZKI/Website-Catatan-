const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point aplikasi
  output: {
    path: path.resolve(__dirname, 'dist'), // Output ke folder dist
    filename: 'bundle.js', // Nama file output
    clean: true, // Membersihkan folder dist sebelum build baru
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'), // Folder untuk serve file
    open: true, // Membuka browser otomatis
    hot: true, // Hot Module Replacement (HMR)
    port: 3000, // Port dev server
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Mendukung file JavaScript
        exclude: /node_modules/, // Mengecualikan node_modules
        use: 'babel-loader', // Menggunakan Babel untuk transpiling
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
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.css'], // Resolusi default file
  },
  mode: 'development', // Mode pengembangan
};






