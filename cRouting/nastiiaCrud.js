"use strict";
//                EXAMPLE
exports.__esModule = true;
module.exports = /** @class */ (function () {
    function cCRUD(arr, req) {
        this.arr = arr;
        this.promise = new Promise(function (res, rej) {
            var data = '';
            req.on('data', function (chunk) { data += chunk; });
            req.on('end', function () { return res(data); });
        });
    }
    cCRUD.prototype.read = function (req, res) {
        return res.end(JSON.stringify(this.arr.filter(function (_a) {
            var c = _a.c;
            return c;
        })));
    };
    cCRUD.prototype.create = function (req, res) {
        var _this = this;
        return this.promise.then(function (newData) {
            // do i need to check for type of c in ts????
            // const newObj: cRoute = JSON.parse(newData);
            // const  c:number =  newObj.c as number;
            // //console.log("type of c:",typeof(c));
            // const newId = Math.max(...this.arr.map(({ id }) => id)) + 1;
            // const objToCreate:dbObject = { id: newId, c };
            // this.arr.push(objToCreate);
            // //console.log(this.arr);
            // return res.end(JSON.stringify(objToCreate));
            var c = JSON.parse(newData).c;
            //console.log(c);
            if (typeof (c) !== 'number') { // do i need this to check in ts????
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify("400 BadRequest"));
                throw new Error("Your data is invalid!");
            }
            else {
                var newId = Math.max.apply(Math, _this.arr.map(function (_a) {
                    var id = _a.id;
                    return id;
                })) + 1;
                var objToCreate = { id: newId, c: c };
                _this.arr.push(objToCreate);
                //console.log(this.arr);
                return res.end(JSON.stringify(objToCreate));
            }
        });
    };
    cCRUD.prototype.update = function (req, res) {
        var _this = this;
        return this.promise.then(function (newData) {
            var _a = JSON.parse(newData), c = _a.c, idft = _a.id;
            //console.log("newData : ",newData);
            var foundObject = _this.arr.find(function (_a) {
                var id = _a.id;
                return id === idft;
            });
            if (!foundObject) {
                return res.end(JSON.stringify("Your id is invalid"));
            }
            foundObject.c = c;
            //console.log(this.arr);
            return res.end(JSON.stringify(foundObject));
        });
    };
    cCRUD.prototype["delete"] = function (req, res) {
        var _this = this;
        return this.promise.then(function (item) {
            var id = JSON.parse(item).id;
            //console.log("Id to delete: ", id);
            var foundIndex = _this.arr.findIndex(function (data) { return data.id === id; });
            if (foundIndex === -1) {
                return res.end(JSON.stringify("Your id is invalid"));
            }
            _this.arr.splice(foundIndex, 1);
            //console.log(this.arr);
            return res.end(JSON.stringify(foundIndex));
        });
    };
    return cCRUD;
}());
