import { HttpStatus } from "./http-status.enum";
export class HttpException extends Error {
    private readonly response: string | Object

    private readonly status: HttpStatus

    private readonly reason: string | Object
    constructor(
        response: string | Object,
        status: HttpStatus,
        reason?: string | Object
    ) {
        super()
        this.response = response
        this.status = status
    }


    getResponse() {
        return this.response
    }

    getStatus() {
        return this.status
    }
}


export class BadRequestException extends HttpException {
    constructor(message, error?) {
        super({
            message, error,
            statusCode: HttpStatus.BAD_REQUEST
        }, HttpStatus.BAD_REQUEST)
    }
}

export class BadGatewayException extends HttpException {
    constructor(message, error) {
        super({
            message, error,
            statusCode: HttpStatus.BAD_REQUEST
        }, HttpStatus.BAD_REQUEST)
    }
}

export class RequestTimeoutException extends HttpException {
    constructor(message, error) {
        super({
            message, error,
            statusCode: HttpStatus.BAD_REQUEST
        }, HttpStatus.BAD_REQUEST)
    }
}