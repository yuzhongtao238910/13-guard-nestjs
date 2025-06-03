
import { RequestMethod } from "./request.method.enum";

export interface MiddlewareConsumer {
    // 返回this来实现链式调用
    apply(...middlewares: any[]): this
    forRoutes(...routes: Array<string|{path: string, method: RequestMethod}|Function>): this
    exclude(...routes: Array<string|{path: string, method: RequestMethod}>): this
}