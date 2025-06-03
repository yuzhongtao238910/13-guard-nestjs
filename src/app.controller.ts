import { Controller, Get, Query, Body, UsePipes, Post } from "@nestjs/common"



import { AppService } from "./app.service"
import { Param } from "@nestjs/common"
import { ParseIntPipe } from "@nestjs/common"
import { ParseFloatPipe } from "@nestjs/common"
import { ParseBoolPipe } from "@nestjs/common"
import { ParseArrayPipe } from "@nestjs/common"
import { ParseUUIDPipe } from "@nestjs/common"
import { ParseEnumPipe } from "@nestjs/common"
import { DefaultValuePipe } from "@nestjs/common"
import { CustomPipe } from "./self-pipe/custome.pipe"
import { ZodValidation } from "./self-pipe/zod-validation.pipe"
import { createCatSchema, CreateCatDto } from "./schema/create-cat.dto"

import { CreateUserDto } from "./schema/create-user.dto"
import { ClassValidationPipe } from "./self-pipe/class-validation.pipe"

enum Roles {
    Admin = "admin",
    VIP = "vip"
}

@Controller('')
// @UsePipes(new ZodValidation(createCatSchema))
// 可以设置控制器级别的，只针对控制器级别的方法生效
// @UseFilters( new CustomExceptionFilter() ) // 这个是控制器级别的，针对所有的生效
// 如果有参数，就只能使用类了，或者是说需要依赖注入
// @UseFilters( CustomExceptionFilter ) // 这个是控制器级别的，针对所有的生效
export class AppController {

    constructor(
        // private readonly appService: AppService
    ) {
        
    }


    @Get("")
    indexe() {
        return "index"
    }

    @Get("number/:id")
    getNumber(@Param("id", ParseIntPipe) id: string) {
        return `The number: ${id}`
    }

    @Get("id/:id")
    getId(@Param("id", new ParseIntPipe()) id: string) {
        return `The id: ${id}`
    }


    @Get("float/:value")
    getFloat(@Param("value", ParseFloatPipe) value: number) {
        return `The Float ${value}`
    }


    @Get("bool/:flag")
    getBool(@Param('flag', ParseBoolPipe) flag: boolean) {
        return `The flag is ${flag}`
    }



    // http://localhost:8080/array/123,123,345
    // 默认就是使用逗号分隔，但是可以自定义分隔符号
    @Get("array/:values")
    getArray(@Param("values", ParseArrayPipe) values: any[]) {
    // http://localhost:8080/array/123@123@345
    // getArray(@Param("values", new ParseArrayPipe({ items: String, separator: "@" })) values: any[]) {
        console.log(values, 56)
        // npm i class-transformer
        // npm i class-validator
        return `${values.join("-")}`
    }

    // uuid
    @Get("uuid/:uuid")
    getUUID(@Param("uuid", ParseUUIDPipe) uuid: string) {
        // ParseUUIDPipe 判断传递过来的id是不是uuid
        return `${uuid} is a uuid`
    }

    //
    @Get("enum/:type")
    getEnumType(@Param("type", new ParseEnumPipe(Roles)) type: string) {
        // ParseUUIDPipe 判断传递过来的id是不是uuid
        return `${type} is a uuid`
    }


    // 默认值管道
    @Get("default")
    getDefault(@Query("username", new DefaultValuePipe("Guest")) username: string) {
        // ParseUUIDPipe 判断传递过来的id是不是uuid
        return `${username} is a default-value`
    }


    // 自定义管道
    @Get("custom/:value")
    getCustom(@Param("value", CustomPipe) value: string, age: number) {
    // getCustom(@Param("value", new CustomPipe()) value: string) {
        // ParseUUIDPipe 判断传递过来的id是不是uuid
        return `${value} is a custom-pipe`
    }


    // UsePipes 可以写到方法上或者是控制器上也可以哈，因为对于一种的crud哈
    @Post("cats-create")
    @UsePipes(new ZodValidation(createCatSchema))
    async createCat(@Body() createCatDto: CreateCatDto) {
        return {
            message: "success",
            status: 200,
            obj: createCatDto
        }
        // return "apple"
    }


    // ClassValidationPipe
    // ClassValidationPipe
    @Post("create/user")
    @UsePipes(new ClassValidationPipe())
    async createUser(@Body() createUserDto: CreateUserDto) {
        return {
            message: "success",
            status: 200,
            obj: createUserDto
        }
        // return "apple"
    }

    @Post("create/dog")
    // @UsePipes(new ClassValidationPipe())
    async createDogr(@Body() createUserDto: CreateUserDto) {
        return {
            message: "success",
            status: 200,
            obj: createUserDto
        }
        // return "apple"
    }


    @Post("create")
    async create(
        @Body(new ClassValidationPipe()) createUserDto: CreateUserDto,
    ) {
    //   this.catsService.create(createCatDto);
        return "11"
    }


    @Get("demo1/:id")
    async demo1(@Param("id") id: string) {
        return "1" + id
    }

}