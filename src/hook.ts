import shimmer from 'shimmer';
import uuid from 'uuid/v4';
import http from 'http';
import cls from 'cls-hooked';

var session = cls.createNamespace("trace");

shimmer.wrap(http, "createServer", function wrapCreateServer(createServer) {
    return function wrappedCreateServer(this: any, requestListener) {
            var handleRequest = session.bind(function(req: http.IncomingMessage, res: http.ServerResponse){
                session.bindEmitter(req);
                session.bindEmitter(res);
                let currentSpanId = uuid();
                cls.getNamespace("trace").set("traceId", currentSpanId);
                console.log("====>createServer")
                console.log(currentSpanId)
                return requestListener(req, res);
            })
            return createServer.call(this, handleRequest);
        }
});
