import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
// import { AppService } from "../app.service";

// 依赖注入就需要假如，否则其实不加也是也可以的
@Injectable()
export class AuthMiddleware implements NestMiddleware {


    constructor(
        // private readonly appService: AppService
    ) {}
    use(req: Request, res: Response, next: NextFunction) {
        // const message = this.appService.getMessage()
        // console.log("1111Request...", req.url, message);

        /**
         * 一般会在此处给req.user赋值
         * 如何赋值关键要看鉴权使用哪个方式
         *      一种是session
         *      一种是jwt
         */
        // 如果使用上次用户登陆后把用户信息保存在session之中
        // req.user = req.session.user

        console.log(req.query.role, 26)
        // 如果使用的是jwt的话
        req.user = {
            id: 1, // 一般userId都是在中间件里面处理的哈
            name: "nick",
            role: req.query.role
        }
        next();
    }
}
