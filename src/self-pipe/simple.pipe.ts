import { PipeTransform, ArgumentMetadata, Injectable, Inject } from "@nestjs/common";

// 自定义管道
@Injectable()
export class SimplePipe implements PipeTransform<string, string> {

    constructor(
        @Inject("PREFIX") private readonly prefix: string
    ) {
        console.log("10", prefix)
    }

    transform(value: string, metadata: ArgumentMetadata) {
        console.log(this.prefix, "--prefix--")
        return value + this.prefix
    }
}