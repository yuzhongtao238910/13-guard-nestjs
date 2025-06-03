
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"


export class ParseBoolPipe implements PipeTransform<string, boolean> {
    transform(value: string): boolean {

        if (value.toLowerCase() === 'true') {
            return true
        } else if (value.toLowerCase() === 'false') {
            return false
        } else {
            // throw 
            throw new BadRequestException("boolean:Validation failed (boolean  string is expected)", 'Bad Request')
        }   
    }
}