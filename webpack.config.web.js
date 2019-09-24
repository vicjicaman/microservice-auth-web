const path = require("path");

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
  resolve: {
    alias: {
      Root: path.resolve(__dirname, "src/common/root"),
      Actions: path.resolve(__dirname, "src/common/actions"),
      UI: path.resolve(__dirname, "src/common/ui"),
      Queries: path.resolve(__dirname, "src/common/queries")
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".json"]
  }
};
