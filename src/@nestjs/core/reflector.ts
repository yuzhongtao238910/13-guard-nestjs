import "reflect-metadata"
import { SetMetadata } from "@nestjs/common"

export class Reflector {
    get(metadataKey, target, key?) {
        return key ? Reflect.getMetadata(metadataKey, target, key) : Reflect.getMetadata(metadataKey, target) 
    }

    static createDecorator<T>() {
        

        function decoratorFactory(metadataValue: T) {
            // AccountController.prototype  propertyKey=index descriptor.value = index()
            // return function (target: object | Function, propertyKey?: string, descriptor?: any) {
            //     // SetMetadata(decoratorFactory, metadataValue)(target, propertyKey, descriptor)

            //     // Reflect.defineMetadata(decoratorFactory, metadataValue, descriptor.value)
            // } 

            return SetMetadata(decoratorFactory, metadataValue)
        }

        return decoratorFactory
    }
}