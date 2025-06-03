
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"


export class ParseIntPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        // 尝试把value变为10进制的整数
        const val = parseInt(value, 10)
        if (isNaN(val)) {
            throw new BadRequestException("---------Validation failed (numeric string is expected)", 'Bad Request')
        }

        return val
    }
}