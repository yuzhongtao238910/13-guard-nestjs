
import { BadRequestException } from "@nestjs/common"
import { PipeTransform } from "@nestjs/common"
import { validate } from "uuid"


export class DefaultValuePipe implements PipeTransform<string, string> {

    constructor(
        private readonly defaultValue: any
    ) {}

    transform(value: string): string {

        return value !== undefined ? value : this.defaultValue
    }
}