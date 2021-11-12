// TODO.等开发完毕了再写
// const path = require("path");

// module.exports = {
//     mode: "production",
//     entry: "./main.js",
//     output: {
//         path: path.resolve(__dirname, "public/dist"),
//         filename: "bundle.js",
//         publicPath: "public"
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 use: {
//                     loader: "babel-loader",
//                     options: {
//                         presets: ["@babel/preset-env"],
//                         plugins: [
//                             ["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]
//                         ]
//                     }
//                 }
//             }
//         ]
//     }
// };