"use strict";
exports.__esModule = true;
exports.DCrud = void 0;
var isCamelCase = function (msg) { return /[A-Z]/.test(msg.substring(1)); };
var camelToSnake = function (msg) {
    return msg.replace(/([a-z\d])([A-Z])/g, "$1_$2").toLowerCase();
};
var isPalindrome = function (msg) {
    return msg == msg.split("").reverse().join("");
};
var DCrud = /** @class */ (function () {
    function DCrud(dbArray, req) {
        this.dbArray = dbArray;
        this.readBufferPromise = new Promise(function (resolve, reject) {
            var data = "";
            req
                .on("data", function (chunk) { return (data += chunk.toString()); })
                .on("end", function () { return resolve(data); });
        });
    }
    DCrud.prototype.read = function (req, res) {
        var dArray = this.dbArray.filter(function (_a) {
            var d = _a.d;
            return d;
        });
        if (req.url.includes("isPalindrome=true")) {
            var dArrayPalindrome = dArray.map(function (item) {
                var newItem = JSON.parse(JSON.stringify(item));
                newItem.isPalindrome = isPalindrome(item.d);
                return newItem;
            });
            return res.end(JSON.stringify(dArrayPalindrome));
        }
        return res.end(JSON.stringify(dArray));
    };
    DCrud.prototype.create = function (req, res) {
        var _this = this;
        return this.readBufferPromise.then(function (data) {
            var newId = Math.max.apply(Math, _this.dbArray.map(function (_a) {
                var id = _a.id;
                return id;
            })) + 1;
            var d = JSON.parse(data).d;
            d = isCamelCase(d) ? camelToSnake(d) : d;
            var objToCreate = { id: newId, d: d };
            _this.dbArray.push(objToCreate);
            return res.end(JSON.stringify(objToCreate));
        });
    };
    DCrud.prototype.update = function (req, res) {
        var _this = this;
        return this.readBufferPromise.then(function (data) {
            var bodyObj = JSON.parse(data);
            var objToChange = _this.dbArray.find(function (item) { return item.id === bodyObj.id && item.d; });
            if (!objToChange) {
                return res.end(JSON.stringify("Bad input values(either ID or D)"));
            }
            objToChange.d = bodyObj.d;
            return res.end(JSON.stringify(objToChange));
        });
    };
    DCrud.prototype["delete"] = function (req, res) {
        var _this = this;
        return this.readBufferPromise.then(function (data) {
            var bodyObj = JSON.parse(data);
            var indToRemove = _this.dbArray.findIndex(function (item) { return item.id === bodyObj.id && item.d; });
            if (indToRemove === -1) {
                return res.end(JSON.stringify("No ID value given / No object with such ID"));
            }
            _this.dbArray.splice(indToRemove, 1);
            return res.end(JSON.stringify("Object successfully deleted"));
        });
    };
    return DCrud;
}());
exports.DCrud = DCrud;
