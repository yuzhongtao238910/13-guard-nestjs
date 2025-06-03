// import { z  } from 'zod';
/**
 * zod 是一个声明式的模式验证库，可以帮我们验证数据结构
 */

// zod 允许我们定义模式schema，然后使用这些模式来验证数据
const { z } = require("zod")
// console.log(z, 777)

// 1- 定义模式 schema
// 定义一个字符串模式
const stringSchema = z.string()
// 定义一个数字模式
const numberSchema = z.number()

// 验证数据
// 我们定义了模式之后，就可以使用parse方法来验证数据，验证成功返回数据本身，否则抛出错误
const res1 = stringSchema.parse("hello")
const res2 = numberSchema.parse(18)
console.log(res1)
console.log(res2)

try {
    const res3 = numberSchema.parse('18')
    console.log(res3)
} catch(error) {
    console.log(error)
}