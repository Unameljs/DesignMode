type eventType = {
    on:(eventName:string,fn:Function)=>void,
    emit:(eventName:string,...args:any[])=>void,
    off:(eventName:string,fn?:Function)=>void,
    once:(eventName:string,fn:Function)=>void
}

type eventListType = {
    [key:string] : any[]
}

class distPath implements eventType {
    eventList:eventListType
    constructor(){
        this.eventList = {}
    }
    on(eventName: string, fn: Function){
        (this.eventList[eventName] || (this.eventList[eventName] = [])).push(fn)
    }
    emit(eventName: string, ...args: any[]){
        if(this.eventList[eventName]){
            this.eventList[eventName].forEach(event=>{
                event.call(this,...args)
            })
        }else{
            throw '暂无该事件'
        }
    }
    off(eventName: string, fn?: Function | undefined){
        if(!this.eventList[eventName]) throw '暂无该事件'
        if(fn){
            let index = this.eventList[eventName].findIndex(v=>v===fn)
            this.eventList[eventName].splice(index,1)
        }else{
            this.eventList[eventName].length = 0
        }
    }
    once(eventName: string, fn: Function){
        let one = (...args:any[])=>{
            fn.call(this,args)
            this.off(eventName,one)
        }
        this.on(eventName,one)
    }
}

const sss = new distPath()

sss.once("aa",(data:any)=>{
    console.log(data);
})
sss.once("aa",(data:any)=>{
    console.log(data);
})

sss.emit("aa",18,19)