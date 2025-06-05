import { ArgumentsHost } from "./arguments-host.interface";
/**
 * canActivate() 函数接收一个参数，即 ExecutionContext 实例。ExecutionContext 继承自 ArgumentsHost。我们在异常过滤器章节中已经见过 ArgumentsHost。
 * 在上述示例中
 * 我们只是使用与 ArgumentsHost 定义相同的辅助方法来获取 Request 对象的引用。有关更多此主题的信息，请参考异常过滤器章节中的参数主机部分。
 * 
 * 通过扩展 ArgumentsHost，ExecutionContext 还增加了一些新的辅助方法，这些方法提供有关当前执行过程的更多详细信息。
 * 这些详细信息有助于构建更通用的守卫，这些守卫可以在一组广泛的控制器、方法和执行上下文中工作。
 */
export interface ExecutionContext extends ArgumentsHost {

    // 用于获取当前的处理类，也就是控制器 AccountController
    getClass<T=any>():T
    // 用于获取路由处理函数，就是指的是对应的路由方法
    getHandler(): Function 
    // async index() {
    //     return `this action return all accounts`
    // }


}