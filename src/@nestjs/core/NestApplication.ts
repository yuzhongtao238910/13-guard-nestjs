import express, { Express, Request as ExpressRequest, Response as ExpressResponse, 
    NextFunction  } from "express"
import path from "path"
import { NestMiddleware, RequestMethod, ArgumentsHost, ExceptionFilter } from "@nestjs/common"

import { INJECTED_TOKENS, DESGIN_PARAMTYPES } from "../common/constant"
import { defineModule } from "../common/module.decorator"
import { APP_FILTER, DECORATOR_FACTORY, APP_PIPE} from "./constants"
import { GlobalHttpExceptionFilter } from "../common/http-exception.filter"
import { PipeTransform } from "@nestjs/common"
export class NestApplication {


    private readonly app: Express = express()

    // 在此处保存全部的providers
    // private readonly providers = new Map<any, any>()


    // 在此处保存所有得provider得实例，key就是token，值就是类得实例
    private readonly providerInstances = new Map<any, any>()

    // 此处存放着全局的provider
    // 保存全局得provider
    private readonly globalProviders = new Set<any>()


    // 需要实现模块之间得隔离
    // 记录每个模块之中有哪些provider得token
    private readonly modulesProviders = new Map<any, any>()

    // 记录所有得中间件
    // 可能是类，可以能是实例，还可能是函数中间件
    private middlewares = []


    // 记录需要排除的路径
    private readonly excludeRoutes = []


    // 这个是nestjs给的默认的全局异常过滤器
    // 添加一个全局的异常过滤器，就是一个处理异常的程序哈
    private readonly defaultGlobalHttpExceptionFilter = new GlobalHttpExceptionFilter()


    // 自定义的全局的异常过滤器
    private readonly globalHttpExceptionFilter = []


    // 这里存放着全局管道
    private readonly globalPipes: PipeTransform[] = []
    


    constructor(private readonly module: any) {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        // 初始化中间件配置
        
    }

    useGlobalPipes(...pipes: PipeTransform[]) {
        console.log(pipes, 63)
        this.globalPipes.push(...pipes)
    }


    useGlobalFilters(...filters: ExceptionFilter[]) {


        defineModule(this.module, filters)

        this.globalHttpExceptionFilter.push(...filters)
    }

    private initMiddlewares() {
        // MiddlewareConsumer就是当前得NestApplication的实例
        this.module.prototype.configure?.(this)
    }

    

    use(middleware) {
        this.app.use(middleware)
        return this
    }

    apply(...middleware: NestMiddleware[]) {
        // console.log(middleware, "middleware")


        // 实际上是类才需要进行加这个
        defineModule(this.module, middleware.filter(fil => fil instanceof Function))
        // 把接收到得中间件放到中间件得数组之中，并且返回当前得实例哈
        this.middlewares.push(...middleware)
        return this
    }

    // 记录需要排除的路径
    exclude(...routeInfos: Array<string|{path: string, method: RequestMethod}>): this {

        

        this.excludeRoutes.push(...routeInfos.map(this.normalizeTputeInfo))

        return this
    }

    isExcluded(reqPath: string, method: RequestMethod) {
        // 遍历要排除的路径，看看个一个排除的路径和当前的请求路径和方法名字匹配哈
        return this.excludeRoutes.some(routeInfo => {
            const {routePath, routeMethod} = routeInfo

            return reqPath === routePath && (RequestMethod.ALL === routeMethod || method === routeMethod)
        })
    }
    forRoutes(...routes: Array<string|{path: string, method: RequestMethod}>) {
        // 把接收到得路由放到路由得数组之中，并且返回当前得实例哈

        // this.routes.push(...routes)
        // 遍历路径信息
        for (const route of routes) {
            // 遍历中间件数组哈
            for (const middleware of this.middlewares) {
                // 遍历中间件数组哈
                // routePath可能是字符串或者是对象
                // 把route格式化为标准对象哈
                const {routePath, routeMethod} = this.normalizeTputeInfo(route)
                this.app.use(routePath, (req, res, next) => {
                    // console.log(routePath, "routePath")
                    // console.log(req.originalUrl, "req.originalUrl")
                    // console.log(req.method, "req.method")
                    // console.log(routeMethod, "routeMethod")
                    // 如果当前的路径要排除的话，那么就不走当前的中间件了
                    if (this.isExcluded(req.originalUrl, req.method)) {
                        next()
                        return
                    }


                    // 如果配置的方法名字是all或者是请求的方法是一样的
                    if (routeMethod === RequestMethod.ALL || routeMethod === req.method) {
                        // console.log("匹配")

                        // 此处中间件可能是一个类或者实例或者方法
                        // 如何区分
                        // 类的话原型上有use
                        // 实例的话，自己有一个use
                        // 函数的话，没有

                        // 原型 | 实例
                        if ('use' in middleware.prototype || 'use' in middleware) { 
// if () {}
                            // 如果方法为ALL，则需要遍历所有的方法
                            // middleware.use(req, res, next)
                            // middleware 可能是一个类或者是函数哈
                            const middlewareInstance = this.getMiddlewareInstance(middleware)
                            middlewareInstance.use(req, res, next)
                        } else if (middleware instanceof Function) {
                            // 函数中间件
                            middleware(req, res, next)
                        } else {
                            next()
                        }

                        
                    } else {
                        // console.log("不匹配")
                        next()
                    }
                })
            }
        }


        /*
        consumer
            // 这块一定要先apply，然后再forRoutes
            .apply(logger1)
            .forRoutes(AppController)
            .apply(logger2)
            .forRoutes(App2Controller)

            然后apply+forRoutes是一对一对的，这能是先apply，然后再forRoutes

            // 如果不加下面这一行的话，访问App2Controller这个的时候，logger1+logger2都会执行，这样是不对的哈
        */

        this.middlewares = []

        return this
    }
    private getMiddlewareInstance(middleware) {
        if ( middleware instanceof Function) {
            // console.log(middleware, "middleware")
            // 这块是需要传参数的哈
            const dependencies = this.resolveDependencies(middleware)
            // console.log(dependencies, "dependencies")
            return new middleware(...dependencies)
        } 
        
        return middleware
    }

    private normalizeTputeInfo(routeInfo) {
        // 默认路径哈
        let routePath = ''
        // 默认是支持所有得方法得
        let routeMethod = RequestMethod.ALL


        // 另外，传递路径得时候是没有前面的/的
        // 传递得就是路径
        if (typeof routeInfo === "string") {
            routePath = routeInfo
        } else if ('path' in routeInfo) {
            // 如果传入的是一个路径对象的话
            routePath = routeInfo.path
            routeMethod = routeInfo.method ?? RequestMethod.ALL
        } else if (routeInfo instanceof Function) {
            // 说明此时是一个控制器哈 先取前缀
            // 如果routeInfo是一个控制器的话，以他的路径前缀作为路径哈
            routePath = Reflect.getMetadata("prefix", routeInfo)
        }


        // cats => /cats
        routePath = path.posix.join("/", routePath)


        return {routePath, routeMethod}
    }

    async initProviders() {
        const imports = Reflect.getOwnMetadata("imports", this.module) ?? []


        const selfProviders = Reflect.getOwnMetadata("providers", this.module) ?? []


        for (const importModule of imports) { // LoggerModule
            // 获取导入模块之中的提供者的数据哈
            /**
                [
                    { provide: 'SUFFIX', useValue: 'suffix' },
                    [class AppleService],
                    { provide: [class LoggerService], useClass: [class LoggerService] },
                    { provide: 'StringToken', useValue: UseValueService {} },
                    { provide: 'FactoryToken', useFactory: [Function: useFactory] }
                ]
             */

            // 这样写就不对了，此处是拿到导入得模块得providers，进行得全量得注册
            // 这样是不对得
            // 1- 有可能导入得模块只导出了一部分并没有进行全量得导出， 需要使用exports进行了过滤
            // 2- 

            //  


            // for (const exportToken of exports) {
            //     // 遍历export导出对象哈

            //     if (this.isModule(exportToken)) {

            //     } else {
            //         const provider = importedProviders.find(provider => provider === exportToken || provider.provide === exportToken)
            //         // 解决第一个问题：需要使用exports进行过滤
            //         if (provider) {
            //             this.addprovider(provider)
            //         }
            //     }

                
            // }
            // 第2个问题：exports之中可能还有module， 需要进行递归处理


            // 再这块来区分是否是动态模块哈

            let importedModule = importModule
            if (importModule instanceof Promise) {
                // 如果导入的是一个promise，说明是一个异步的动态模块
                importedModule = await importModule
            }

            if ('module' in importedModule) {
                // 如果导入的模块有module属性，说明这个个是一个动态模块
                const { module, providers, exports, controllers } = importedModule

                const oldProviders = Reflect.getMetadata("providers", module) ?? []
                // console.log(oldProviders, "oldProviders")
                // 需要和之前的老的进行合并，就是和@Module里面的providers以及exports进行合并哈
                const newProviders = [
                    ...(oldProviders ?? []),
                    ...(providers ?? [])
                ]

                const oldExports = Reflect.getMetadata("exports", module) ?? []
                const newExports = [
                    ...(oldExports ?? []),
                    ...(exports ?? [])
                ]

                const oldControllers = Reflect.getMetadata("controllers", module) ?? []
                const newControllers = [
                    ...(oldControllers ?? []),
                    ...(controllers ?? [])
                ]

                // 需要把新的providers和exports进行合并
                Reflect.defineMetadata("providers", newProviders, module)
                Reflect.defineMetadata("exports", newExports, module)
                Reflect.defineMetadata("controllers", newControllers, module)

                defineModule(module, newProviders)
                defineModule(module, newControllers)
                
                this.registerProvidersFromModule(module, this.module)
                
            } else {
                // 普通模块哈
                this.registerProvidersFromModule(importedModule, this.module)
            }

            
        }

        // 遍历并且添加每一个提供者
        for (const provider of selfProviders) {
            this.addprovider(provider, this.module)
        }

        // console.log(this.modulesProviders, "this.modulesProviders")
        // console.log(this.providerInstances, "this.providerInstances")
        // console.log(this.globalProviders, "this.globalProviders")

        // setTimeout(() => {
        //     let app1 = this.modulesProviders.get(AppModule)
        //     let app2 = this.modulesProviders.get(CommonModule)
        //     console.log(app1, "this.modulesProviders.get(AppModule)")
        //     console.log(app2, "this.modulesProviders.get(CommonModule)")
        //     console.log(app1 === app2, "this.modulesProviders.get(AppModule) === this.modulesProviders.get(CommonModule)")
        // }, 1000)
    }

    private registerProvidersFromModule(module, ...parentModules) {

        // 获取导入的是不是全局模块，是否有这个元数据
        const global = Reflect.getOwnMetadata("global", module)


        const exports = Reflect.getOwnMetadata("exports", module) ?? []

        const importedProviders = Reflect.getMetadata("providers", module) ?? []


        for (const exportToken of exports) {
            // 遍历export导出对象哈

            if (this.isModule(exportToken)) {
                // 执行递归操作
                this.registerProvidersFromModule(exportToken, module, ...parentModules)
            } else {
                const provider = importedProviders.find(provider => provider === exportToken || provider.provide === exportToken)

                // 解决第一个问题：需要使用exports进行过滤
                if (provider) {
                    // 子模块 父模块
                    [module, ...parentModules].forEach(module => {
                        this.addprovider(provider, module, global)
                    })
                    // this.addprovider(provider, module)
                }
            }

            
        }



        // 这种是为了处理导入的模块之中包含controller
        // 再处理完这个
        this.initController(module)
    


        // for (const provider of importedProviders) {
        //     this.addprovider(provider)
        // }
    }

    private isModule(exportToken) {
        // 咋判断是否是一个模块，
        return exportToken && exportToken instanceof Function && Reflect.getMetadata("isModule", exportToken)
    }


    /**
     * 原来得provider都混在了一起，现在需要分开，每个模块有自己得provider
     * 需要记录自己得provider
     * @param provider 
     * @returns 
     */
    private addprovider(provider, module, global = false) {


        
        /**
         * let modulesProviders = {
         *     appModule: new Set(),
         *     CommonModule: new Set(),
         *     OtherModule: new Set(),
         * }
         */
        // 获取当前模块的providers
        // 此providers代表module这个模块的providers得token

        // 这个providers再global为true的时候，就是this.globalProviders
        // 如果global是false的话，就是module对应的providers set
        const providers = global ? this.globalProviders : (this.modulesProviders.get(module) ?? new Set())

        if (!this.modulesProviders.has(module)) {
            // 因为set本身就可以去重的，里面只会有不一样的值，其实这个判断没什么用的，
            // !this.modulesProviders.has(module)这个判断其实是没有用的，我先不删除了哈

            if (!global) {
                // 如果当前不是全局的，才需要这样的
                // 全局的就放在 this.globalProviders 
                this.modulesProviders.set(module, providers)
            }

            
        }

        // 如果token对应的实例已经有了，就不再需要实例化了

        // 获取要注册的provider的token
        let injectToken = provider.provide ?? provider
        // 判断是否已经注册过了
        if (this.providerInstances.has(injectToken)) {
            // 实例池子里面已经有此token对应的实例了，就不再需要创建了
            providers.add(injectToken)
            return
        }





        // let providers = this.modulesProviders.get(module)
        // if (!providers) {

        // }

        // 为了避免循环依赖，每次添加前可以做判断，如果map里面已经存在，那么就直接返回了
        // const injectToken = provider.provide ?? provider
        // // 如果已经注册过了，就不要往下走了
        // if (this.providers.has(injectToken)) return;


        if (provider.provide && provider.useClass) {
            // 1- 获取类的定义 
            const Clazz = provider.useClass
            // 2- 获取此类的参数
            const dependencies = this.resolveDependencies(Clazz)
            // 创建提供者类的实例
            const value = new Clazz(...dependencies)
            // 最后注册provider
            // this.providers.set(provider.provide, value)
            this.providerInstances.set(provider.provide, value)
            providers.add(provider.provide)

        } else if (provider.provide && provider.useValue) {
            // 如果提供的是一个值，那么就直接放到map里面哈
            // this.providers.set(provider.provide, provider.useValue)
            this.providerInstances.set(provider.provide, provider.useValue)
            providers.add(provider.provide)
        } else if (provider.provide && provider.useFactory) {
            // 1- 获取要注入工厂函数的参数
            const inject = provider.inject ?? []
            // 2- 解析出来参数的值
            const injectedValues = inject.map((injectToken) => {
                return this.getProviderByToken(injectToken, module)
            })
            // 3- 执行工厂方法获取返回的值
            const value = provider.useFactory(...injectedValues)
            // 4- 注册
            // this.providers.set(provider.provide, value)
            this.providerInstances.set(provider.provide, value)
            providers.add(provider.provide)
        } else {
            const dependencies = this.resolveDependencies(provider) ?? []
            const value = new provider(...dependencies)
            // this.providers.set(provider, value)
            this.providerInstances.set(provider, value)
            providers.add(provider)
        }

        // console.log(this.providers, 146)
    }


    private resolveDependencies(Class) {
        
        // 取得注入的token
        const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, Class) ?? []

        // 获取构造函数的参数的类型
        const constructorParams = Reflect.getMetadata(DESGIN_PARAMTYPES, Class)


        return constructorParams?.map((param, index) => {

            const module = Reflect.getMetadata("nestModule", Class)


            return this.getProviderByToken(injectedTokens[index] ?? param, module)

        }) || []

    }


    private getProviderByToken(injectedToken, module) {

        // 先判断是不是全局的




        // 如何通过token再特定的模块下找到对应的provider
        // 1- 先找到此模块对应的token set
        // 在判断此injectedToken在不在此set之中
        // return this.providers.get(injectedToken) ?? injectedToken
        if (this.modulesProviders.get(module)?.has(injectedToken)) {
            return this.providerInstances.get(injectedToken)
        } else if (this.globalProviders.has(injectedToken)) {
            return this.providerInstances.get(injectedToken)
        } else {
            return null
        }
    }
    async initController(module) {
        const controllers = Reflect.getOwnMetadata("controllers", module) || []


        for (const Controller of controllers) {

            const dependencies = this.resolveDependencies(Controller)

            const controller = new Controller(...dependencies)
            // 获取控制器类的路径前缀
            const prefix = Reflect.getOwnMetadata("prefix", Controller) || ''


            const controllerPrototype = Reflect.getPrototypeOf(controller)

            // 获取控制器上的绑定的异常过滤器的数组哈
            const controllerFilters = Reflect.getOwnMetadata("filters", Controller) ?? []

            defineModule(this.module, controllerFilters.filter(fil =>fil instanceof Function))

            // 获取控制器上的pipes
            const controllerPipes = Reflect.getOwnMetadata("pipes", Controller) ?? []            


            for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
                const method = controllerPrototype[methodName]
                // 获取此函数上绑定的方法名字的元数据
                const httpMethod = Reflect.getMetadata("method", method)
                // 获取此函数上绑定的路径的元数据
                const pathMetaData = Reflect.getMetadata("path", method)

                // 获取重定向的地址
                const redirectUrl = Reflect.getMetadata("redirectUrl", method)
                // 获取重定向的状态码
                const redirectStatusCode = Reflect.getMetadata("redirectStatusCode", method)

                // 获取状态码
                const statusCode = Reflect.getMetadata("statusCode", method)

                // 获取响应头
                const headers = Reflect.getMetadata("headers", method) ?? []


                // 获取方法上绑定的异常过滤器的数组
                const methodFilters = Reflect.getMetadata("filters", method) ?? []

                // 获取方法上绑定的pipes
                const methodPipes = Reflect.getMetadata("pipes", method) ?? []

                const pipes = [...controllerPipes, ...methodPipes]

                

                // 如果方法名字不存在，那么就不处理了
                if (!httpMethod) {
                    continue
                }

                defineModule(this.module, methodFilters.filter(fil =>fil instanceof Function))
                // 合并方法和控制器上的过滤器哈
                const filters = [...controllerFilters, ...methodFilters]

                const routePath = path.posix.join("/", prefix, pathMetaData)
                this.app[httpMethod.toLowerCase()](routePath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                    
                    const host = { // 因为nestjs不但支持http，还支持graphql，rpc等等其他的方式哈
                        // 这块是为了兼容处理哈
                        switchToHttp: () => {
                            return {
                                getRequest: ()=> req,
                                getResponse: ()=> res,
                                getNext: ()=> next
                            }
                        }
                    }

                    // 这块执行的时候可能会发生错误
                    try {


                        // let a;
                        // console.log(a.toString())

                        const args = await this.resolveParams(controller, method, methodName, req, res, next, host, pipes)

                        const result = await method.call(controller, ...args)


                        if (result?.url) {
                            return res.redirect(res?.statusCode || 302, result?.url)
                        }

                        // 判断如果需要重定向，就直接重定向到指定的redirectUrl里面去
                        if (redirectUrl) {
                            return res.redirect(redirectStatusCode || 302, redirectUrl)
                        }



                        // 状态码，在nestjs之中，响应的状态码默认是200，但是post请求的状态码是201，我们可以使用@HttpCode来修改状态码的
                        // 201的意思就是实体创建成功哈
                        if (statusCode) {
                            res.statusCode = statusCode
                        } else if (httpMethod === "POST") {
                            res.statusCode = 201
                        }

                    

                        // 判断controller的methodName方法里面是否有使用Response或者Res参数装饰器，如果用了任何一个，就不在这里发送响应
                        // 有方法自己处理

                        const responseMeta = this.getResponseMetadata(controller, methodName)
                        // 判读是否有注入res或者是response装饰器
                        // 或者是注入了，但是传递了passthrough参数，都会由nestjs来返回相应
                        if (!responseMeta || responseMeta?.data?.passthrough) {

                            // 设置响应头
                            headers?.forEach(header => {
                                res.setHeader(header.name, header.value)
                            })


                            // 把返回值序列化发回给客户端
                            res.send(result)
                        }


                        // let a;
                        // console.log(a.toString())


                    } catch(error) {
                        // console.log(error)

                        //
                        await this.callExceptionFilters(error, host, methodFilters, controllerFilters)
                    }
                    
                })

            }

        }
    }

    getFilterInstance(filter) {
        if (filter instanceof Function) {
            // 这是一个类

            const dependencies = this.resolveDependencies(filter)

            // console.log(dependencies, 621)

            return new filter(...dependencies)

        }

        // 这块是实例哈
        return filter
    }

    private callExceptionFilters(error: Error, host: any, methodFilters, controllerFilters) {
        const allFilters = [
            ...methodFilters, // 先找方法上的
            ...controllerFilters, // 再找控制器上的
            ...this.globalHttpExceptionFilter, // 再找全局的
            this.defaultGlobalHttpExceptionFilter
        ]

        // 按照先方法过滤器，控制器过滤器，用户配置的全局的过滤器，默认全局过滤器的顺序来遍历
        // 找到第一个可以处理的过滤器就可以了

        // 每个过滤器只会处理自己关心的异常哈

        // 过滤器有catch装饰器哈
        // filter还可能是一个类或者是实例哈
        for (const filter of allFilters) {

            let filterInstance = this.getFilterInstance(filter)

            // 取出此异常过滤器关心的异常或者说要处理的异常
            const exceptions = Reflect.getMetadata("catch", filterInstance.constructor) ?? []

            // console.log(exceptions, 635, filter)

            // 如果没有配置catch或者说是
            // 当前的错误刚好就是配置的catch的exception的类型或者是子类哈
            if (exceptions.length == 0 || exceptions.some(exception => error instanceof exception)) {
                // 说明是全局的，或者是catch里面没有传递参数
                filterInstance.catch(error, host)
                break;
            }

            
        }
    }


    getResponseMetadata(controller, methodName) {
        const metaData =Reflect.getMetadata("params", Reflect.getPrototypeOf(controller), methodName) || []
        return metaData.filter(Boolean).find(item => item.key === 'Res' || item.key === 'Response' || item.key === "Next")
    }

    async resolveParams(target: any, method: any, methodName: any, req: ExpressRequest, res: ExpressResponse, next: NextFunction, host: any, pipes: PipeTransform[]) {

        // const existingParameters = Reflect.getMetadata("params", Reflect.getPrototypeOf(target), methodName) || []


        const existingParameters = Reflect.getMetadata("params", Reflect.getPrototypeOf(target), methodName) ?? []

        let temp = existingParameters
        if (existingParameters && existingParameters.length) {
            // temp = existingParameters.sort((a, b) => a.parameterIndex - b.parameterIndex)
        }

        // console.log(temp, 750)
        

        return Promise.all(temp.map(async (item, index) => {
            const {key, data, factory, pipes: paramPipes, metatype} = item


            let value;
            
            switch (key) {
                case "Req":
                case "Request":
                    value = req
                    break;
                case "Res":
                case "Response":
                    value = res
                    break;
                case "Query":
                    value = data ? req.query[data] : req.query
                    break;
                case "Headers":
                    value = data ? req.headers[data] : req.headers
                    break;
                case "Session":
                    value = data ? req.session[data] : req.session
                    break;
                case "Ip":
                    value = req.ip
                    break;
                case "Param":
                    value = data ? req.params[data] : req.params
                    break;
                case "Body":
                    value = data ? req.body[data] : req.body
                    break;
                case "Next":
                    value = next
                    break;
                case DECORATOR_FACTORY:
                    value = factory(data, host)
                    break;
                    // return req.user
                default:
                    value = null
                    break;
            }

            // 全局的 -》 控制器的 -》 方法的

            const allPipes = [...this.globalPipes, ...pipes, ...paramPipes]

            // console.log(value, 798, key, allPipes.length)

            for (const pipe of allPipes.filter(Boolean)) {
                const pipeInstance = this.getPipeInstance(pipe)
                // console.log('++')
                const type = key.toLowerCase() === DECORATOR_FACTORY ? "custom" : key.toLowerCase()
                // 在这块给管道进行的传参数哈
                value = await pipeInstance.transform(value, {
                    type: type,
                    // 提供参数的原类型是什么？
                    // TypeScript 接口在转译期间消失。因此，如果方法参数的类型声明为接口而不是类，则 metatype 值将为 Object
                    metatype: metatype,
                    data: data
                })
            }

            return value;
        }))
        // .filter(item => item)
    }

    private getPipeInstance(pipe) {
        if (typeof pipe === 'function') {
            const dependencies = this.resolveDependencies(pipe)
            return new pipe(...dependencies)
        }
        return pipe
    }

    async initGlobalFilters() {
        // 获取当前模块的所有的providers
        const providers = Reflect.getMetadata("providers", this.module) ?? []
    
        for (const provider of providers) {
            if (provider.provide && provider.provide === APP_FILTER) {
                const providerInstance = this.getProviderByToken(APP_FILTER, this.module)

                this.useGlobalFilters(providerInstance)
            }
        }
    }

    async initGlobalPipes() {
        const providers = Reflect.getMetadata("providers", this.module) ?? []
    
        for (const provider of providers) {
            if (provider.provide && provider.provide === APP_PIPE) {
                const providerInstance = this.getProviderByToken(APP_PIPE, this.module)

                this.useGlobalPipes(providerInstance)
            }
        }
    }

    async listen(port: number) {
        // 在这块支持异步
        await this.initProviders()
        await this.initMiddlewares()
        await this.initGlobalFilters(); // 初始化全局的过滤器，为了可以使全局的过滤器具有依赖注入的功能哈

        await this.initGlobalPipes(); // 初始化全局的管道哈
        await this.initController(this.module)
        // 调用express实例的listen方法启动一个express的app服务器，监听port端口
        this.app.listen(port, () => {
            // 启动成功后，打印日志
            
        })
    }

}