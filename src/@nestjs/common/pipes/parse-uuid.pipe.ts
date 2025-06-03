
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"
import { validate } from "uuid"


export class ParseUUIDPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        // 用来验证某个值是否是uuid
        if (!validate(value)) {
            throw new BadRequestException("uuid:Validation failed (uuid is expected)", 'Bad Request')
        }

        return value
    }
}