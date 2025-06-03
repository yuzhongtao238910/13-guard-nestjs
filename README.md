- 管道
    - 管道是一个用 @Injectable() 装饰器注释的类，它实现了 PipeTransform 接口。
    - 管道的两个作用
        - 转换：将输入数据转换为所需的形式（例如，从字符串转换为整数）
        - 验证：评估输入数据，如果有效，则简单地将其传递，否则抛出异常

- 基本流程
    - Nest 在方法调用之前插入一个管道，管道接收将要传递给方法的参数并对其进行操作。
    - 任何转换或验证操作都会在此时进行，然后调用路由处理程序，并传递（可能已经转换过的）参数。

- Nest 提供了许多内置的管道，您可以直接使用。您还可以构建自己的自定义管道
    - 内置管道
        - ParseIntPipe
        - ParseFloatPipe
        - ParseBoolPipe
        - ValidationPipe 这个也是内置的哈

- 要使用管道，我们需要将管道类的实例绑定到适当的上下文中。
```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

- 基于架构的验证
    - 我们尝试运行我们的服务之前确保post的body是有效的
```typescript
@Post()
async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto)
}
export class createCatDto {
    name: string
    age: number
    bread: string
}
// 我们希望确保对 create 方法的任何传入请求都包含一个有效的 body。
// 因此，我们必须验证 createCatDto 对象的三个成员。我们可以在路由处理程序方法中执行此操作，但这样做是不理想的，因为它会违反单一责任原则（SRP）。
// 另一种方法可能是创建一个验证器类并将任务委托给它。这种方法的缺点是我们必须记住在每个方法的开头调用这个验证器。
```
    - 对象架构验证
        - npm i zod
        - zod 是一个声明式的模式验证库，可以帮我们验证数据结构
    - 类验证器


- 自定义管道
    - 
```typescript
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```
- 每个管道必须实现 transform() 方法以履行 PipeTransform 接口合同。此方法有两个参数：value,metadata
    - value 参数是当前处理的方法参数（在其被路由处理方法接收之前），metadata 是当前处理的方法参数的元数据。元数据对象具有以下属性：
```typescript
export interface ArgumentMetadata {
    type: 'body' | 'query' | 'param' | 'custom';
    metatype?: Type<unknown>;
    data?: string;
}
```
    - type: 指示参数是 body @Body()、query @Query()、param @Param() 还是自定义参数
    - metatype: 提供参数的元类型，例如 String。注意：如果您在路由处理方法签名中省略类型声明，或使用原生 JavaScript，则该值为 undefined。
    - data: 传递给装饰器的字符串，例如 @Body('string')。如果您将装饰器括号留空，则为 undefined。

- metatype
- 以及让pipe支持依赖注入
- 验证的2种方式
    - 对象架构验证
        - 沟通过构建schema
    - 类验证器
        - 另一种验证技术，类验证器
        - Nest 与 class-validator 库配合良好。这个强大的库允许您使用基于装饰器的验证。
        - 基于装饰器的验证非常强大，特别是当它与 Nest 的管道功能结合使用时，因为我们可以访问处理属性的 metatype。在开始之前，我们需要安装所需的包：
        - npm i --save class-validator class-transformer

- 全局范围的管道
    - 由于 ValidationPipe 被创建为尽可能通用，我们可以通过将其设置为全局范围管道来充分利用其效用
    - 从而将其应用于整个应用程序中的每个路由处理程序。
```typescript
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
```


- 全局管道，就无法实现依赖注入的
    - 注意，就依赖注入而言，从任何模块外部（如上述示例中的 useGlobalPipes()）注册的全局管道无法注入依赖项
    - 因为绑定是在任何模块的上下文之外完成的。为了解决这个问题，您可以使用以下构造直接从任何模块设置全局管道：