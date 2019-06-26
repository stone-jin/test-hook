// import './hook'
import koa from 'koa';
import uuid from 'uuid/v4';
import cls, { getNamespace } from 'cls-hooked';

var session = cls.createNamespace("trace");

const app = new koa();

app.use(async (ctx, next)=>{
    return new Promise((resolve, reject)=>{
        cls.getNamespace('trace').bindEmitter(ctx.req);
        cls.getNamespace('trace').bindEmitter(ctx.res);
        var hello = session.bind(async ()=>{
            const correlationId = uuid();
            cls.getNamespace('trace').set('traceId', correlationId);
            console.log("=====>"  + correlationId)
            resolve(await next());
        })
        hello.call(this);
    })
})

async function hello(user){
    return new Promise((resolve, reject)=>{
        setTimeout(async()=>{
            console.log("traceId:" +  getNamespace('trace').get('traceId'));
            resolve('1234');
        }, 3000)
    })
}

app.use(async (ctx, next)=>{
    console.log("====>");
    ctx.body = await hello(ctx.query.user);
});

app.listen(8006);