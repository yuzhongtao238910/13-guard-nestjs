function task() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let a ;
                a.toString()
                resolve()
            } catch(e) {
                reject(e)
            }
            
        }, 2000)
    })
    
}





(async function handler() {
    try {
        await task()
    } catch(e) {
        console.log(e, 25)
    }
})()
// handler()