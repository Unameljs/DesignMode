/* 
1. 定义
发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发送改变时，所有依赖于它的对象都将得到状态改变的通知。
订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，
也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。
2. 例子
比如我们很喜欢看某个公众号号的文章，但是我们不知道什么时候发布新文章，要不定时的去翻阅；这时候，我们可以关注该公众号，当有文章推送时，会有消息及时通知我们文章更新了。
上面一个看似简单的操作，其实是一个典型的发布订阅模式，公众号属于发布者，用户属于订阅者；用户将订阅公众号的事件注册到调度中心，
公众号作为发布者，当有新文章发布时，公众号发布该事件到调度中心，调度中心会及时发消息告知用户。 
*/

/* 
1.创建一个对象
2.在该对象上创建一个缓存列表（调度中心）
3.on 方法用来把函数 fn 都加到缓存列表中（订阅者注册事件到调度中心）
4.emit 方法取到 arguments 里第一个当做 event，根据 event 值去执行对应缓存列表中的函数（发布者发布事件到调度中心，调度中心处理代码）
5.off 方法可以根据 event 值取消订阅（取消订阅） 
*/

class Event {
    constructor(){
        this.eventList = {}
    }
    on(eventName,fn){
        // 如果缓存列表已经有该事件就添加事件 如果该事件还不存在，就创建一个数组缓存
        (this.eventList[eventName] || (this.eventList[eventName] = [])).push(fn)
    }
    emit(eventName,...args){
        if(this.eventList[eventName]){
            this.eventList[eventName].forEach(event => {
                //args是类数组 使用call需要解构成参数列表
                event.apply(this,args) //apply接受参数数组
                event.call(this,...args) //call接受参数列表
            });
        }else{
            throw '暂时没有该订阅'
        }
    }
    off(eventName,fn){
        if(!this.eventList[eventName]) return false
        if(!fn){
            //如果没有传入指定订阅 那么就删除全部订阅
            this.eventList[eventName] && (this.eventList[eventName].length = 0);
        }else{
            //删除指定订阅的第一个
            let index = this.eventList[eventName].findIndex(v=>v===fn)
            this.eventList[eventName].splice(index,1)
        }
    }
}

const bus = new Event()

//用apply [ '我是aa', '我是bb', { name: '小曼' } ]
//用call [ [ '我是aa', '我是bb', { name: '小曼' } ] ]

function a (...args){
    console.log('a',args);
}
function b (...args){
    // console.log('b',args);
}

bus.on('aa',a)
bus.on('aa',b)//这个不会

bus.off('aa',b)

bus.on('aa',b)//这个还会输出

bus.emit('aa','我是aa','我是bb',{name:"小曼"})