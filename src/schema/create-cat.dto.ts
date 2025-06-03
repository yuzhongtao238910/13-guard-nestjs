// 1- 导入z对象
import { z } from "zod"



// 定义一个名为createCatSchema的模式，用于验证cat对象的结构哈
// 2- 定义一个对象的模式
export const createCatSchema = z.object({       
    name: z.string(), // 定义对象的name属性，需要是字符串
    age: z.number() // age属性，必须是数字哈
}).required() // 指定对象之中所有的字段都是必填的哈


// 3- 通过zod的infer方法从createCatSchema获得或者收拾推导出一个cat对象的类型哈

// 为什么转换的时候可以非必填，因为再更新的时候有一些字段就可以不填了，这样更新+创建就只需要一套了
export type CreateCatDto = z.infer<typeof createCatSchema>
/*
type CreateCatDto = {
    name?: string;
    age?: number;
}
*/