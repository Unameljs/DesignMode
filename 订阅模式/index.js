class Event {
    constructor(){
        this.eventList = {}
    }
    on(eventName,fn){
        (this.eventList[eventName] || (this.eventList[eventName] = [])).push(fn)
    }
    emit(eventName,...args){
        if(this.eventList[eventName]){
            this.eventList[eventName].forEach(event => {
                event.apply(this,args)
                event.call(this,...args)
            });
        }else{
            throw '暂时没有该订阅'
        }
    }
    off(eventName,fn){
        if(!this.eventList[eventName]) return false
        if(!fn){
            this.eventList[eventName] && (this.eventList[eventName].length = 0);
        }else{
            let index = this.eventList[eventName].findIndex(v=>v===fn)
            this.eventList[eventName].splice(index,1)
        }
    }
}

const bus = new Event()

function a (...args){
    console.log('a',args);
}
function b (...args){
    // console.log('b',args);
}

bus.on('aa',a)
bus.on('aa',b)

bus.off('aa',b)

bus.on('aa',b)

bus.emit('aa','我是aa','我是bb',{name:"小明"})
