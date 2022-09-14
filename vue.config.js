const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  // pages: {
  //   index: {
  //     //入口
  //     entry: "src/main.js",
  //   },
  // },
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://toutiao.itheima.net/',
  //       pathRewrite: { '^/api': '' },
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
})
