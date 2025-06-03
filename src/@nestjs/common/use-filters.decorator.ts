import "reflect-metadata"
import { ExceptionFilter } from "./exception-filter.interface"
// import { defineModule } from "./module.decorator"

// export function UseFilters(...filters: ExceptionFilter[]) {
export function UseFilters(...filters: any[]) {
    return function (target: object | Function, propertyKey?: string | symbol, descriptor?: any) {
        if (descriptor) {
            // 方法装饰器
            // 针对某一个特定路由应用过滤器
            Reflect.defineMetadata("filters", filters, descriptor.value)
        } else {
            
            // defineModule(target, filters)
            // 类级别的哈



            // 针对一个controller的所有的应用都使用该过滤器
            Reflect.defineMetadata("filters", filters, target)
        }
    }
}