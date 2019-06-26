"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./hook");
const koa = require("koa");
const cls_hooked_1 = require("cls-hooked");
const app = new koa();
async function hello(user) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            console.log("traceId:" + cls_hooked_1.getNamespace('trace').get('traceId'));
            resolve('1234');
        }, 3000);
    });
}
app.use(async (ctx, next) => {
    console.log("====>");
    ctx.body = await hello(ctx.query.user);
});
app.listen(8006);
// app.use(async (ctx, next)=>{
//     return new Promise((resolve, reject)=>{
//         cls.getNamespace('trace').bindEmitter(ctx.req);
//         cls.getNamespace('trace').bindEmitter(ctx.res);
//         var hello = session.bind(async ()=>{
//             const correlationId = uuid();
//             cls.getNamespace('trace').set('traceId', correlationId);
//             console.log("=====>"  + correlationId)
//             resolve(await next());
//         })
//         hello.call(this);
//     })
// })
