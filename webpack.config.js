const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js"]
  },
  plugins: [new CopyPlugin([{ from: "src/styles.css", to: "./styles.css" }])],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "react-scrollable-accordion",
    libraryTarget: "umd",
    globalObject: "this"
  },
  externals: {
    react: "react"
  }
};
