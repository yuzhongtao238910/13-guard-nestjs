// npm i --save class-validator class-transformer

// 用于再ts之中执行对象验证的库，他通常用于验证传入的请求数据，以确保数据格式和内容符合预期


import "reflect-metadata"
import { IsString, IsInt, validate } from "class-validator"


class CreateUserDto {

    @IsString()
    name: string;

    @IsInt()
    age: number;
}

const user = new CreateUserDto()

user.name = "1";
// user.age = 1
(user as any).age = '1'

// class-transformer
// 比如说这个user是客户端传递过来的，所以是需要先通过plainToInstance变成类的实例哈
validate(user)
    .then(errors => {
        if (errors.length > 0) {
            /*
                [
                    ValidationError {
                        target: CreateUserDto { name: '1', age: '1' },
                        value: '1',
                        property: 'age',
                        children: [],
                        constraints: { isInt: 'age must be an integer number' }
                    }
                ]

            */
            console.log(`Validation failed, errors: `, errors)
        } else {
            console.log("success")
        }
    })

export {}