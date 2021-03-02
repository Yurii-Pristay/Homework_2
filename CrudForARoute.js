const path = require("path");
const fs = require("fs");

const file = require("./file.json");

module.exports = class CrudForARoute {

    constructor(dbArray, req) {

        this.dbArray = dbArray;
        this.promise = new Promise((res) => {
            let data = "";
            req.on("data", chunk => {
                data += chunk
            });
            req.on("end", () => res(data));
        });
    }



    POST(req, res) {

        return this.promise.then(users => {

            const newId = Math.max(...this.dbArray.map(({id}) => id)) + 1;
            const { a } = JSON.parse(users);
            const objToCreate = {id: newId, a};
            this.dbArray.push(objToCreate);
            file.push(JSON.parse(users));

            fs.writeFile(path.join(__dirname, "file.json"), JSON.stringify(file), err => {
                if (err) {
                    throw (err);
                }
                // adding request body to file.json;
            });
            return res.end(JSON.stringify(objToCreate));
        });
    };


    PUT(req, res) {

        return this.promise.then(users => {

            const { a } = JSON.parse(users);
            const findObject = this.dbArray.find((user) =>  user.a);
            if(!findObject){

                return res.end(JSON.stringify("Invalid data"));
            }
            findObject.a = a;

            return res.end(JSON.stringify(findObject));
        });
    };


    DELETE(req,res){

        return this.promise.then(users => {

            const { id } = JSON.parse(users);
            const findObject = this.dbArray.findIndex(user => user.id === id);
            if(!(findObject === -1)){
                this.dbArray.splice(findObject,1);

                return res.end(JSON.stringify(`Object with id: ${findObject} was deleted`))
            }

            return res.end(JSON.stringify("Invalid data"));
        });
    };


    GET(req,res) {

        return this.promise.then(users => {

            const { id } = JSON.parse(users);

            if(id>5 && id!==1) {
                return res.end(JSON.stringify(file.filter(({a}) => a)));

            }
            return res.end(JSON.stringify(this.dbArray.filter(({a}) => a)));

        });
    }
}


