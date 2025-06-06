// import {  } from "@nestjs/core"
import "reflect-metadata"
import { DECORATOR_FACTORY } from "../core/constants"


export const createParamDecorator = (keyOrFactory: String  | Function ) => {
    return function (data?: any, ...pipes: any[]) {
        // 执行的时候是从右到左
        return function (target: Object, propertyKey: string, parameterIndex: number) {
            // 给类的原型的propertyKey 也就是 handleRequest 这个方法上添加元数据
            // 数组里面应该是放置哪个位置应该是使用的哪个装饰器

            const existingParameters = Reflect.getMetadata("params", target, propertyKey) || []
            // existingParameters.push({
            //     parameterIndex,
            //     key
            // })

            // 这是修饰这个方法的哈
            // propertyKey就是方法名字哈
            // 从原型的方法属性获取到参数类型的数组
            // 并且取索引对应的类型哈
            const metatype = Reflect.getMetadata("design:paramtypes", target, propertyKey)[parameterIndex]

            // console.log(metatype, "metatype")

            // 如果传递过来的是一个函数的话，会存放参数索引，key定死为装饰器工厂，
            if (keyOrFactory instanceof Function) {
                // 这里面就是自定义装饰器了
                existingParameters[parameterIndex] = {
                    parameterIndex,
                    key: DECORATOR_FACTORY,
                    factory: keyOrFactory,
                    data,
                    pipes,
                    metatype
                }


            } else {
                // 这样写是去解决 handleRequest(@Request() request: ExpressRequest, age: number, @Req() req: ExpressRequest)
                existingParameters[parameterIndex] = {
                    parameterIndex,
                    key: keyOrFactory,
                    data,
                    pipes,
                    metatype
                }
            }

            


            // existingParameters[parameterIndex] = key
            Reflect.defineMetadata(`params`, existingParameters, target, propertyKey)
        }
    }
}


export const Request = createParamDecorator("Request")
export const Req = createParamDecorator("Req")


// handleQuery(@Query() query: any, @Query("id") id: any) 
// query是可以是整个的对象，也可以传递参数
export const Query = createParamDecorator("Query")

export const Headers = createParamDecorator("Headers")

export const Session = createParamDecorator("Session") 

export const Ip = createParamDecorator("Ip") 

// Param
export const Param = createParamDecorator("Param") 

export const Body = createParamDecorator("Body")

export const Res = createParamDecorator("Res")
export const Response = createParamDecorator("Response")


export const Next = createParamDecorator("Next")