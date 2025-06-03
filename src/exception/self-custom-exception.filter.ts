// 我们希望异常还可以带上请求路径，以及时间戳，但是默认的异常过滤器是没有这个行为的

import { ArgumentsHost, BadRequestException, ExceptionFilter, RequestTimeoutException, Catch, Inject } from "@nestjs/common";

import { Response, Request } from "express"
// 就是捕获这个异常
// 只有遇到这个异常才会执行

// 可以接受单个参数或逗号分隔的列表。这使您可以一次为多种类型的异常设置过滤器。
// @Catch(BadRequestException)
@Catch(BadRequestException, RequestTimeoutException)
export class CustomExceptionFilter implements ExceptionFilter {


    constructor(
        @Inject("PREFIX") private readonly prefix
    ) {
        // 如果是说存在了参数的话
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        
        const response = ctx.getResponse<Response>()

        const request = ctx.getRequest<Request>()

        const status = exception.getStatus()

        return response.status(status)
            .json({
                statusCode: status,
                message: exception.getResponse()?.message || '',
                timestamp: new Date().toLocaleString(),
                path: request.originalUrl, 
                method: request.method,
                prefix: this.prefix
            })
    }
}