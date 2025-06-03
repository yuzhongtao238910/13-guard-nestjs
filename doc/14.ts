// // npm i --save class-validator class-transformer

// 类的转换器
// class-transformer 是一个在类和普通对象之间转换的库
// 一般和class-validator一起使用
import {
    plainToInstance, // 普通对象变成实例
    instanceToPlain // 类的实例变成普通对象
} from "class-transformer"



class User {
    name: string
    age: number
}


// 这是一个普通对象，而不是User的实例哈
const plainUser = {
    name: "nick",
    age: 18
}
const user = plainToInstance(User, plainUser)
console.log(user instanceof User)

// 这又是变成了一个普通对象
const plainObject = instanceToPlain(user)
console.log(plainObject, 29, plainObject instanceof User)

export {}