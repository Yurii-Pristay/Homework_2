"use strict";
exports.__esModule = true;
exports.eRouter = void 0;
var eCrudFuncs_1 = require("./eCrudFuncs");
function eRouter(dbArray, req, res) {
    var e = new eCrudFuncs_1.ECrudFuncs(dbArray, req, res);
    if (req.method === "GET") {
        e.read();
    }
    else if (req.method === "POST") {
        e.create();
    }
    else if (req.method === "PUT") {
        e.update();
    }
    else if (req.method === "DELETE") {
        e.delte();
    }
}
exports.eRouter = eRouter;
