const path = require("path");
const {WatchRunPlugin} = require("./webpack.config.common");

module.exports = {
  entry: "./src/web/index.js",
  output: {
    path: path.join(__dirname, "/dist/web"),
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
  plugins: [new WatchRunPlugin("web")],
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
