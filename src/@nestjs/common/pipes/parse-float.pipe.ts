
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"


export class ParseFloatPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        // 尝试把value变为10进制的整数
        const val = parseFloat(value)
        if (isNaN(val)) {
            throw new BadRequestException("++++Validation failed (float string is expected)", 'Bad Request')
        }

        return val
    }
}