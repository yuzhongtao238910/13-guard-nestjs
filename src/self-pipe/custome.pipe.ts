import { PipeTransform, ArgumentMetadata, Injectable } from "@nestjs/common";

// 自定义管道
@Injectable()
export class CustomPipe implements PipeTransform<string, string> {

    constructor(
    ) {
    }

    transform(value: string, metadata: ArgumentMetadata) {
        console.log(`value: ${value}`)
        console.log(JSON.stringify(metadata), 13)
        return value
    }
}