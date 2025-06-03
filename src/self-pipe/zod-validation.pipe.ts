import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";


export class ZodValidation implements PipeTransform {
    
    constructor(
        private schema: ZodSchema
    ) {

    }
    
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('--------', value)
        try {
            // value是传递进来的值哈
            // 使用zod的schema来进行解析和验证，如果通过就返回解析后的结果
            // 解析失败，就抛出异常
            return this.schema.parse(value)
        } catch(error) {
            throw new BadRequestException("Validation failed")
        }
    }
}