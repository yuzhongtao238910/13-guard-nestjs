export interface ArgumentMetadata {
    // 代表是当前是哪个类型的参数装饰器哈
    // 一共是就这4个值哈
    // body 请求体
    // query 查询参数
    // param路径参数
    // custom 自定义参数装饰器
    type: 'body' | 'query' | 'param' | 'custom'; //  指示参数是 body @Body()、query @Query()、param @Param() 还是自定义参数

    // 如果您在路由处理方法签名中省略类型声明，或使用原生 JavaScript，则该值为 undefined。
    metatype?: any; // 提供参数的原类型

    // 传递给装饰器的字符串，例如 @Body('string')。如果您将装饰器括号留空，则为 undefined。
    data?: string;
}