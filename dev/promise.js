let p1 = new Promise((resolve, reject) => {
    resolve('成功了')
})

let p2 = new Promise((resolve, reject) => {
    resolve('success')
})

let p3 = Promise.reject('失败')

Promise.all([p1, p2]).then((result) => {
    console.log(result) //['成功了', 'success']
}).catch((error) => {
    console.log(error)
})

Promise.all([p1, p3, p2]).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error) // 失败了，打出 '失败'
})