function demo() {
    return 1
}

async function demo2() {
    const res = await demo()

    const y = await 2
    console.log(y, 99999999)

    console.log(res)

    return res
}


demo2()