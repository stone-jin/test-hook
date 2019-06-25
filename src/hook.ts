import shimmer from 'shimmer';
import uuid from 'uuid/v4';
import http, { IncomingMessage, ServerResponse } from 'http';
import cls, { getNamespace } from 'cls-hooked';

var session = cls.createNamespace("trace");

shimmer.wrap(http, "createServer", function wrapCreateServer(createServer) {
    return function wrappedCreateServer(this: any, requestListener) {
            var handleRequest = session.bind(function(req: IncomingMessage, res: ServerResponse){
                session.bindEmitter(req);
                session.bindEmitter(res);
                let currentSpanId = uuid();
                getNamespace("trace").set("traceId", currentSpanId);
                console.log("====>createServer")
                console.log(currentSpanId)
                return requestListener(req, res);
            })
            return createServer.call(this, handleRequest);
        }
});