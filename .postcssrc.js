module.exports = {
    plugins: {
        // 配置使用 postcss-pxtorem 插件
        // 作用 ：把px转成为rem
      'postcss-pxtorem': {
        // lib-flexible的REM适配方案，把一行分为10份，每份就是十分之一
        // 所以 rootValue 应该设置为设计稿宽度的十分之一
        // 我们的设计稿是 750px ；所以宽度应该设置为 750 / 10 = 75
        // 但是建议设计为 37.5 ，因为vant 是基于 375 写的
        // 所以必须设计为37.5
        // 唯一的缺点就是使用我们的设计稿的尺寸必须 / 2
        // 有没有更好的方法？
        //      如果是Vant的样式，就按照 37.5 来转换
        //      如果是自己的样式，就按照 75 来转换
        //      通过查询文档， rootValue 支持两种类型
        //      数字：固定的数值
        //      函数：可动态处理返回
        //          postcss-pxtorem 处理每个css文件都会来调用这个函数
        //          它会把被处理的css 文件 的信息通过参数传给该函数
        rootValue({file}){
            return file.indexOf('vant')!==-1 ? 37.5:75
        },
        // rootValue: 37.5,

        // 配置要转换的 css 属性
        // * 表示所有
        propList: ['*'],
      },
    },
  };