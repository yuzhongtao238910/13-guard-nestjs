import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module"
import { CustomExceptionFilter } from "./exception/self-custom-exception.filter"
import { ValidationPipe } from "@nestjs/common"

// import { loggerFunction } from "./middleware/logger.function.middleware"

// function getMiddleware(val) {
//     return (req, res, next) => {
//         console.log(val, "val")
//         next()
//     }
// }

// class Apple {}

// const apple = new Apple()

// console.log(apple instanceof Function) // false
// console.log(Apple instanceof Function) // true


// console.log(String === String, String)
async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // 这样就是注册了全局中间件，可以绑定到每个注册的路由上
    // app.use(loggerFunction)

    // app.use((req, res, next) => {
    //     console.log("全局中间件")
    //     next()
    // })

    // app.use(getMiddleware("123"))


    // 这个是全局异常过滤器哈
    // 异常过滤器是可以设置为全局的哈，这块无法进行依赖注入哈
    // app.useGlobalFilters(new CustomExceptionFilter());


    // app.useGlobalPipes(new ValidationPipe());


    /**
     * 全局守卫在整个应用程序中使用，适用于每个控制器和每个路由处理程序。
     * 就依赖注入而言，从任何模块外部注册的全局守卫（如上例中的 useGlobalGuards()）无法注入依赖项，
     * 因为这是在任何模块上下文之外完成的。为了解决这个问题，可以使用以下结构从任何模块中直接设置守卫：
     */
    // 全局守卫 在这这块还没办法依赖注入的
    // app.useGlobalGuards(new AuthGuard2());

    // useGlobalGuards

    await app.listen(8080)
}
bootstrap()

