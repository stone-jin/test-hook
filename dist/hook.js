"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shimmer = require("shimmer");
const uuid = require("uuid/v4");
const http = require("http");
const cls = require("cls-hooked");
var session = cls.createNamespace("trace");
shimmer.wrap(http, "createServer", function wrapCreateServer(createServer) {
    return function wrappedCreateServer(requestListener) {
        var handleRequest = session.bind(function (req, res) {
            session.bindEmitter(req);
            session.bindEmitter(res);
            let currentSpanId = uuid();
            cls.getNamespace("trace").set("traceId", currentSpanId);
            console.log("====>createServer");
            console.log(currentSpanId);
            return requestListener(req, res);
        });
        return createServer.call(this, handleRequest);
    };
});
