import "reflect-metadata"

interface ModuleMetadata {
    controllers?: Function[];
    providers?: any[];
    exports?: any[];// 模块的导出，把自己的一部分的providers导出给别的模块使用，别的模块只要导入了自己的这个模块
    imports?: any[];// 导入的模块，导入别的模块，把别的模块的providers给自己用
}

// 定义模块装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
    return function (target: Function) {
        // TODO  定义元数据
        // 给模块类添加元数据
        // target === AppModule
        Reflect.defineMetadata("controllers", metadata.controllers, target)

        // 给模块类添加元数据providers: metadata.providers
        Reflect.defineMetadata("providers", metadata.providers, target)

        // 在类上保存exports

        Reflect.defineMetadata("exports", metadata.exports, target)

        // 在类上保存imports
        Reflect.defineMetadata("imports", metadata.imports, target)




        // 当一个类使用module装饰器得时候，就可以添加标识他是一个模块得元数据
        // 标识是一个模块
        Reflect.defineMetadata("isModule", true, target)


        // 把控制器得类和提供者得类都对应得模块进行关联
        // 给控制器
        defineModule(target, metadata.controllers)

      

        // let providers = (metadata.providers ?? []).filter(Boolean).map(provider => {
        //     if (provider instanceof Function) {
        //         return provider
        //     } else if (provider?.useClass instanceof Function) {
        //         return provider.useClass
        //     } else {
        //         return null
        //     }
        // }).filter(Boolean)

        // defineModule(target, providers)


        
        /*

        providers:[
            AppService,
            {
                provide: "PREFIX",
                useValue: "prefix"
            },
            // 这样在全局过滤器的时候是可以依赖注入的
            {
                provide: APP_FILTER,
                useClass: CustomExceptionFilter,
            }
        ],
        
        */

        
        // 只有类才需要，依赖注入哈
        // 但是这样写的话有点问题，这个provider可能是一个类
        // defineModule(target, (metadata.providers ?? []).map((provider: any) => provider.useClass).filter(Boolean))

        defineModule(target, (metadata.providers ?? [])
            .map((provider: any) => provider instanceof Function ? provider : provider.useClass)
            .filter(Boolean))
        // 其实这行代码我们到现在还没有使用到哈
        // defineModule(target, metadata.providers ?? [])

    }
}

export function defineModule( nestModule, targets = []) {
    // 遍历targets数组，为每个元素添加元数据
    // key：nestModule
    // value：nestModule是对应得模块
    targets.forEach(target => {
        // console.log(target, 89999)
        // console.log(target instanceof Function, "target")
        Reflect.defineMetadata("nestModule", nestModule, target)
    })
}

// 此时所有的导出的provider都变成全局的了
export function Global() {
    return function (target: Function) {
        Reflect.defineMetadata("global", true, target)
    }
}


export interface DynamicModule extends ModuleMetadata {
    module: Function,
}