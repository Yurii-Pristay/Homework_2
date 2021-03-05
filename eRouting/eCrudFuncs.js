"use strict";
exports.__esModule = true;
exports.ECrudFuncs = void 0;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var ECrudFuncs = /** @class */ (function () {
    function ECrudFuncs(dbArray, req, res) {
        this.dbArray = dbArray;
        this.req = req;
        this.res = res;
        this.readDataPromise = new Promise(function (resolve, reject) {
            var data = '';
            req.on('data', function (chunk) { return (data += chunk.toString()); });
            req.on('end', function () { return resolve(data); });
        });
    }
    ECrudFuncs.prototype.read = function () {
        if (this.req.url.includes("?persantage=true")) { //params wich need to show percentage
            var percentage = this.dbArray.filter(function (item) { return item.e === true; }).length / this.dbArray.filter(function (item) { return item.e === false; }).length;
            return this.res.end(JSON.stringify(percentage * 100) + "% true to false");
        }
        else {
            return this.res.end(JSON.stringify(this.dbArray.filter(function (_a) {
                var e = _a.e;
                return e;
            })));
        }
    };
    ECrudFuncs.prototype.create = function () {
        var _this = this;
        return this.readDataPromise.then(function (data) {
            console.log('data', data);
            var newId = Math.max.apply(Math, _this.dbArray.map(function (_a) {
                var id = _a.id;
                return id;
            })) + 1;
            var objToCreate = { id: newId, e: JSON.parse(data) };
            _this.dbArray.push(objToCreate);
            return _this.res.end(JSON.stringify(_this.dbArray[getRandomInt(1, _this.dbArray.length)]));
        });
    };
    ECrudFuncs.prototype.update = function () {
        var _this = this;
        return this.readDataPromise.then(function (data) {
            var _a = JSON.parse(data), id = _a.id, e = _a.e;
            var updateObj;
            _this.dbArray.map(function (item) {
                if (item.id === id) {
                    item.e = e;
                    updateObj = item;
                }
            });
            return _this.res.end(JSON.stringify(updateObj));
        });
    };
    ;
    ECrudFuncs.prototype.delte = function () {
        var _this = this;
        return this.readDataPromise.then(function (data) {
            var idToRemove = JSON.parse(data);
            var indToRemove = _this.dbArray.findIndex(function (_a) {
                var id = _a.id;
                return id === idToRemove;
            });
            if (indToRemove === -1) {
                return _this.res.end(JSON.stringify("Element with id " + idToRemove + " wasn't found"));
            }
            _this.dbArray.splice(indToRemove, 1);
            return _this.res.end(JSON.stringify("Element with id " + idToRemove + " was deleted"));
        });
    };
    return ECrudFuncs;
}());
exports.ECrudFuncs = ECrudFuncs;
