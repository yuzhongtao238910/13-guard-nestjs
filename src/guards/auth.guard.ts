import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Request } from "express"


/**
 * 每个守卫必须实现一个 canActivate() 函数。
 * 该函数应返回一个布尔值，指示当前请求是否被允许。
 * 它可以同步或异步（通过 Promise 或 Observable）返回响应。Nest 使用返回值控制下一步操作：
 *      如果返回 true，请求将被处理。
        如果返回 false，Nest 将拒绝请求。
 */
@Injectable()
export class AuthGuard implements CanActivate {

    constructor (
        private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();

        // throw new Error("Method not implemented.");
        console.log(1999)

        /*
            正常的业务是判断权限哈
            从处理程序的方法的元数据上来获取角色的信息

            context.getHandler() 是获取当前的路由处理函数
         */
        const roles = this.reflector.get("roles", context.getHandler())

        console.log(roles, 35)
        // 如果没有为此路由处理函数来设置角色，表示此路由可以被任何人访问
        if (!roles) {
            return true
        }
        
        const req = context.switchToHttp().getRequest<Request>()

        // 获取当前的用户以及角色
        // const user = {
        //     id: 1, // 一般userId都是在中间件里面处理的哈
        //     name: "nick",
        //     role: request.query.role
        // }
        // http://localhost:8080/account?role=admin
        // http://localhost:8080/account?role=user

        console.log(req.user, 53)

        return matchRoles(roles, req.user.role)
    }
    

}

function matchRoles(roles, role) {
    return roles.includes(role)
}