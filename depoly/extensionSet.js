let bindTap = document.getElementsByClassName("bindTap");
for (let i = 0; i < bindTap.length; i++) {
    let clicker = bindTap[i];
    switch (i) {
        case 0:
            clicker.addEventListener("click", () => {
                console.log("不带分号的debugger");
                let a = 1,
                    b = 2;
                debugger
                let c = a + b;
                console.log(c)
            })
            break;
        case 1:
            clicker.addEventListener("click", () => {
                console.log("带分号的debugger");
                let a = 1,
                    b = 2;
                debugger;
                let c = a + b;
                console.log(c)
            })
            break;
        case 2:
            clicker.addEventListener("click", () => {
                console.log("（多语句）后面还带语句的debugger");
                let a = 1,
                    b = 2;
                debugger;
                let c = a + b;
                console.log(c)
            })
            break;
        case 3:
            clicker.addEventListener("click", () => {
                console.log("（多语句）前面、后面还带语句的debugger");
                let a = 1,
                    b = 2;
                debugger;
                let c = a + b;
                console.log(c)
            })
            break;
        case 4:
            clicker.addEventListener("click", () => {
                console.log("（多语句）前面还带语句的debugger");
                let a = 1,
                    b = 2;
                debugger
                let c = a + b;
                console.log(c)
            })
            break;
        case 5:
            clicker.addEventListener("click", () => {
                console.log("使用Function生成的debugger");
                let fn = new Function("debu" + "gger");
                fn()
                console.log("尝试运行")
            })
            break;
        case 6:
            clicker.addEventListener("click", () => {
                console.log("使用Function生成的多参数debugger");
                let fn = new Function("x", "debugger");
                fn()
                console.log("尝试运行")
            })
            break;
        case 7:
            clicker.addEventListener("click", () => {
                console.log("预防简单的检测");
                let a = ";debugger;"
                if (a !== ";debug" + "ger;") {
                    console.log("用户行为异常")
                }
                debugger
                console.log("如无提示异常，则验证通过")
            })
            break;
        default:
            clicker.addEventListener("click", () => { 
                console.log("系统错误", i);
                console.log("系统错误" + i)
                throw new RangeError("系统错误" + i);
            })
            break;
    }
}