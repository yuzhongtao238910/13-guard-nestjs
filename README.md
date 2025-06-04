- 守卫
    - 守卫是一个用于@Injectable() 装饰器注释的类，它实现了CanActivate接口
    - Request -> Middleware -> Guard -> Pipe -> Before Interceptor -> Route handler -> After Interceptor -> Exception filter -> Response
    - 请求 -》 守卫 -》管道 -》 拦截器前 -》路由处理程序 -》 拦截器后 -> 异常过滤器 -》 响应

- 概念
    - 守卫有一个单一职责。它们根据运行时的某些条件（如权限、角色、ACL 等）决定给定的请求是否会被路由处理程序处理。这通常被称为授权
    - 授权（以及与其通常协作的认证）通常在传统的 Express 应用程序中由中间件处理。中间件是处理认证的一个好选择，因为令牌验证和将属性附加到 request 对象等操作与特定路由上下文（及其元数据）没有强烈关联。
    - 但中间件本质上是“哑”的。它不知道在调用 next() 函数之后将执行哪个处理程序。而守卫有访问 ExecutionContext 实例的权限，因此确切知道接下来将执行什么。它们被设计为与异常过滤器、管道和拦截器类似，可以在请求/响应周期中的恰当位置插入处理逻辑，并以声明性方式进行。这有助于保持代码的 DRY（Don't Repeat Yourself）原则和声明性。