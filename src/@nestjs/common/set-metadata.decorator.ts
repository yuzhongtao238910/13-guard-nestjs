import "reflect-metadata"

export function SetMetadata(metadataKey, metadataValue) {
    return function (target: object | Function, propertyKey?: string, descriptor?: any) {
        if (descriptor) {
            // 说明装饰的是方法
            // async index() {
            //      return `this action return all accounts`
            // }
            Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value)
        } else {
            Reflect.defineMetadata(metadataKey, metadataValue, target)
        }
    }
}