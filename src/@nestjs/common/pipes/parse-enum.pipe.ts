
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"

export class ParseEnumPipe implements PipeTransform<string, string> {

    constructor(
        private readonly enumType: any
    ) {
        // console.log(enumType, 10)
    }

    transform(value: string): string {

        console.log(value, 1555)

        const enumValues = Object.values(this.enumType)

        if (!enumValues.includes(value)) {
            // return 
            throw new BadRequestException("enum:Validation failed (enum string is expected)", 'Bad Request')
        }

        return value
    }
}