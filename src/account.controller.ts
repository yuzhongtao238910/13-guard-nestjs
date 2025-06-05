import { Controller, Get, Query, Body, UsePipes, Post, UseGuards } from "@nestjs/common"

import { AuthGuard } from "./guards/auth.guard"
import { AuthGuard2 } from "./guards/auth2.guard"
import { Roles } from "./roles.decorator"
import { AuthMiddleware } from "./middleware/auth.middleware"
import { Roles2 } from "./roles2.decorator"
@Controller('account')
// @UseGuards(AuthGuard2)
// @Roles2(["admin", "super"]) // 这是和原来一样的，key会默认一个key的
// @UsePipes(new ZodValidation(createCatSchema))
// 可以设置控制器级别的，只针对控制器级别的方法生效
// @UseFilters( new CustomExceptionFilter() ) // 这个是控制器级别的，针对所有的生效
// 如果有参数，就只能使用类了，或者是说需要依赖注入
// @UseFilters( CustomExceptionFilter ) // 这个是控制器级别的，针对所有的生效

// 依赖注入的时候就不能放实例，只能是类
// @UseGuards(AuthGuard)
export class AccountController {

    constructor(
        // private readonly appService: AppService
    ) {
        
    }

    // http://localhost:8080/account?role=admin
    // http://localhost:8080/account?role=user
    // @UseGuards(AuthGuard2)
    @UseGuards(AuthGuard)
    @Get()
    // 此装饰器的作用是给当前的index函数添加了角色数组的元数据
    @Roles("admin", "super") // 用来表明哪些角色可以访问路由
    // @Roles2(["admin", "super"]) // 这是和原来一样的，key会默认一个key的
    // Roles是我们自己写的装饰器，然后Roles2是nestjs内置提供了，通过：Reflector.createDecorator<string[]>()
    async index() {
        return `this action return all accounts`
    }
}