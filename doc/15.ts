
// 大概是这个意思哈
function plainToInstance(Clazz, obj) {
    let instance = new Clazz()

    for (let key in obj) {
        instance[key] = obj[key]
    }
}

function instanceToPlain(instance) {
    // 最简单的做法

    return JSON.parse(JSON.stringify(instance))
}


export {}