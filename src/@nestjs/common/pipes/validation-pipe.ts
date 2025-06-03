import { BadRequestException, PipeTransform } from "@nestjs/common";
import { validate, ValidationError } from "class-validator"
import { plainToInstance } from "class-transformer";

// 这个是内置的，已经内置好了哈
export class ValidationPipe implements PipeTransform {

    constructor() {

    }

    // 此处的value只是一个原生对象哈
    async transform(value: any, metadata?: any) {

            // 如果没有传递类型，就不需要校验了
            // 如果传递的是字符串这些也是不需要校验了哈
            if (!metadata.metatype || !this.needValidate(metadata.metatype)) {
                return value
            }

            const instance = plainToInstance(metadata.metatype ,value)
            

            const errors = await validate(instance)

            if (errors.length > 0) {
                // 说明校验失败了
                throw new BadRequestException(this.formatErrors(errors), "message")
            } else {
                return value
            }
    }



    private needValidate(metatype: Function): boolean {
        // 这些基本类型都不需要校验哈
        const types: Function[] = [String, Boolean, Number, Array, Object]

        return !types.includes(metatype)
    }

    private formatErrors(errors: ValidationError[]) {
        return errors.map(error => {
            console.log(error, 45)
            for (const property in error.constraints) {
                return `${error.property} - ${error.constraints[property]}`
            }
        }).join(",")
    }
    
}