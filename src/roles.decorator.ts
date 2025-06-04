import "reflect-metadata"
import { SetMetadata } from "@nestjs/common"
// 定义一个名为Roles的函数，该函数接收任意数量的角色名字并且返回一个装饰器
export function Roles(...roles: string[]) {
    // 调用SetMetadata，将键roles和角色的数组作为元数据设置在目标上
    return SetMetadata('roles', roles)
}
// function decorator(target, propertyKey, descriptor) {
//     Reflect.defineMetadata('roles', Roles, decorator.value)
//     Reflect.getMetadata('roles', Roles, decorator.value)
// }