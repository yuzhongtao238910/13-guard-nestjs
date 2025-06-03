
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"


interface ParseArrayOptions {
    items?: any,
    separator?: string
}

export class ParseArrayPipe implements PipeTransform<string, any[]> {

    constructor(
        private readonly options?: ParseArrayOptions
    ) {
        console.log(this.options, 16)
    }

    transform(value: string): any[] {
        // 尝试把value变为10进制的整数


        if (!value) {
            // 如果没有传值，那么就返回空数组哈
            return []
        }

        const { items = String, separator = ',' } = this.options ?? {}

        // console.log(items, 300)
        

        // console.log(value, 30, value.split(separator))

        // '123,123,345' 
        return value.split(separator).map(it => {
            // console.log(it, "1")
            if (items === String) {
                return it;
            } else if (items === Number) {
                const val = Number(it)
                if (isNaN(val)) {
                    throw new BadRequestException("++++Validation failed (number is expected)", 'Bad Request')
                }
                return val;
            } else if (items === Boolean) {
                if (it.toLowerCase() === 'true') {
                    return true
                } else if (it.toLowerCase() === 'false') {
                    return false
                } else {
                    // throw 
                    throw new BadRequestException("boolean:Validation failed (boolean string is expected)", 'Bad Request')
                }
            }
        })
    }
}