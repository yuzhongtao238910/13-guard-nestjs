const { z } = require("zod")
const { email } = require("zod/v4")
// zod可以定义复杂的嵌套结构哈
// 一般都是对象/数组/联合类型,等等
const userSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email()
})
let user1 = {
    name: "zhangsan",
    age: 18,
    email: "yzt@126.com"
}

let user2 = {
    name: "apple",
    age: 22,
    email: "yzt@126.com",
    hobby: "1"
}

let user3 = {
    name: "apple",
    age: '22',
    email: "yzt@126.com",
    hobby: "1"
}

try {
    const res1 = userSchema.parse(user1)
    console.log(res1)
    const res2 = userSchema.parse(user2)
    console.log(res2)

    const res3 = userSchema.parse(user3)
    console.log(res3)
} catch(error) {
    console.log(error, 28)
}