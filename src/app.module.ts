import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { APP_FILTER, APP_PIPE } from "@nestjs/core"
import { CustomExceptionFilter } from "./exception/self-custom-exception.filter"
import { SimplePipe } from "./self-pipe/simple.pipe"


@Module({
    controllers: [AppController],
    providers:[
        {
            provide: "PREFIX",
            useValue: "prefix"
        },
        {
            provide: APP_PIPE,
            useClass: SimplePipe
        }
    ],
    exports: [
        // AppService
    ]
})
export class AppModule {}
