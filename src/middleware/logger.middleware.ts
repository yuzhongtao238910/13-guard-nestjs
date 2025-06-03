import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AppService } from "../app.service";

// 依赖注入就需要假如，否则其实不加也是也可以的
@Injectable()
export class LoggerMiddleware implements NestMiddleware {


    constructor(
        private readonly appService: AppService
    ) {}
    use(req: Request, res: Response, next: NextFunction) {
        const message = this.appService.getMessage()
        console.log("1111Request...", req.url, message);
        next();
    }
}
