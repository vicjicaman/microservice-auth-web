const path = require("path");
const {WatchRunPlugin} = require("./webpack.config.common");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/server/index.js",
  target: "node",
  externals: [nodeExternals()],

  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [new WatchRunPlugin("server")],
  resolve: {
    alias: {
      Root: path.resolve(__dirname, "src/common/root"),
      Actions: path.resolve(__dirname, "src/common/actions"),
      UI: path.resolve(__dirname, "src/common/ui"),
      PKG: path.resolve(__dirname, "pkg"),
      Queries: path.resolve(__dirname, "src/common/queries")
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".json"]
  }
};
