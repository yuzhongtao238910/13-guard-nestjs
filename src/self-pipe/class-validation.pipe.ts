import { BadRequestException, PipeTransform } from "@nestjs/common";
import { validate } from "class-validator"
import { plainToInstance } from "class-transformer";

export class ClassValidationPipe implements PipeTransform {

    constructor() {

    }

    // 此处的value只是一个原生对象哈
    async transform(value: any, metadata?: any) {

            // data: undefined 就是 @Body(),没有传参数哈
            // { metatype: [class CreateUserDto], type: 'body', data: undefined } 15
            // console.log(metadata, 15)


            // 如果没有传递类型，就不需要校验了
            // 如果传递的是字符串这些也是不需要校验了哈
            if (!metadata.metatype || !this.needValidate(metadata.metatype)) {
                return value
            }

            const instance = plainToInstance(metadata.metatype ,value)
            

            const errors = await validate(instance)

            // console.log(errors, 31)
            if (errors.length > 0) {
                // console.log(errors, 33)
                // 说明校验失败了
                throw new BadRequestException("validation failed", "message")
            } else {
                return value
            }
    }



    private needValidate(metatype: Function): boolean {
        // 这些基本类型都不需要校验哈
        const types: Function[] = [String, Boolean, Number, Array, Object]

        return !types.includes(metatype)
    }
    
}