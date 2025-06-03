// http 异常过滤器

import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express"

/**
 * 默认情况下，这个操作由一个内置的全局异常过滤器执行，该过滤器处理类型为 HttpException（及其子类）的异常。
 * 当异常是未识别的（既不是 HttpException 也不是继承自 HttpException 的类），内置的异常过滤器会生成以下默认的 JSON 响应：
 * 
 *  {
        "statusCode": 500,
        "message": "Internal server error"
    }
 */

export class GlobalHttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp()

        const response = ctx.getResponse<Response>()

        if (response.headersSent) {
            // 就是在send后又出现了报错，实际上这个时候我们不需要处理了
            return; // 如果此相应已经发送给客户端了，那么就不需要处理了哈
        }

        if (exception instanceof HttpException) {
            const responseException = exception.getResponse()
            const status = exception.getStatus()
            //  HttpException（及其子类）
            if (typeof responseException === 'string') {
                // 下面这种情况哈
                // throw new HttpException('Forbidden-apple', HttpStatus.FORBIDDEN)
                return response.status(status).json({
                    statusCode: status,
                    message: responseException
                })
            } else {
                /**
                 *  throw new HttpException({
                        // status: HttpStatus.FORBIDDEN,
                        code: "10001", // 这还可以自定义code码哈
                        error: "这是一个自定义的消息" // 自定义的错误消息
                    }, HttpStatus.FORBIDDEN, {
                        // 第三个构造函数参数（可选）——options——可用于提供错误原因。这个 cause 对象不会被序列化到响应对象中，
                        // 但它对于日志记录非常有用，提供了有关导致 HttpException 被抛出的内部错误的宝贵信息。
                        cause: "这块是造成的原因"
                    })
                 */

                return response.status(status).json(responseException)
            }

        } else {
            // 异常是未识别的

            return response.status(500).json({
                statusCode: 500,
                message: "Internal server error",
                error: exception.message
            })
        }
    }
    
}