import "reflect-metadata"


// 定义一个装饰器工厂函数，可以返回方法&类的装饰器
// 参数是可以接收守卫
export function UseGuards(...guards: any[]) {
    // 还是可以放到函数/控制器/全局上的
    return function (target: object | Function, propertyKey?: string, descriptor?: any) {
        if (descriptor) {
            // 说明装饰的是方法
            // async index() {
            //      return `this action return all accounts`
            // }
            Reflect.defineMetadata("guards", guards, descriptor.value)
        } else {
            Reflect.defineMetadata("guards", guards, target)
        }
    }
}