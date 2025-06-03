import 'reflect-metadata'



import { PipeTransform } from '@nestjs/common'


export function UsePipes (...pipes: PipeTransform[]) {
    return function (target: object | Function, propertyKey?: string, descriptor?: any) {
        if ( descriptor ) {
            // 说明装饰的是一个函数
            Reflect.defineMetadata('pipes', pipes, descriptor.value)
        } else {
            Reflect.defineMetadata('pipes', pipes, target)
        }
    }
}