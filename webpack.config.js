module.exports = {
  mode: "production",
  target: "node",
  entry: {
    main: "./source/index.ts"
  },
  output: {
    path: require("node:path").resolve(__dirname, "./build"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /.*\.test\..*/
      }
    ]
  }
};
