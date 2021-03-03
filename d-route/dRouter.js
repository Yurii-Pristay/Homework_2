"use strict";
exports.__esModule = true;
exports.dRoute = void 0;
var dCrud_1 = require("./dCrud");
function dRoute(req, res, dbArray) {
    var d = new dCrud_1.DCrud(dbArray, req);
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    if (req.method === "GET") {
        d.read(req, res);
    }
    else if (req.method === "POST") {
        d.create(req, res);
    }
    else if (req.method === "PUT") {
        d.update(req, res);
    }
    else if (req.method === "DELETE") {
        d["delete"](req, res);
    }
}
exports.dRoute = dRoute;
