import { Request, Response, NextFunction } from "express";


// 这是一个函数式中间件
export function loggerFunction(req: Request, res: Response, next: NextFunction) {
    console.log("loggerFunction")
    next()
}