function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

module.exports = class Erouting {
    constructor(dbArray, req) {
        this.dbArray = dbArray;
        this.readDataPromise = new Promise((resolve, reject) => {//promise which often used
            let data = '';
            req.on('data', (chunk) => (data += chunk.toString()));
            req.on('end', () => resolve(data));
        });
    }
    
    //I created routing instead of CRUD methods(no create, read, updatete, delete methods, yes routes  )
    routing(req, res) {
        if (req.method === "GET") {
            const url = require('url')
            const qParam = url.parse(req.url, true).search || "";
            if (qParam.includes("?percentage=true")) {//params wich need to show percentage
                let percentage = this.dbArray.filter(item => item.e === true).length / this.dbArray.filter(item => item.e === false).length;
                return res.end(JSON.stringify(percentage * 100)+"% true to false",);
            } else {
                return res.end(JSON.stringify(this.dbArray.filter(({ e }) => e)));
            }
        }

        if (req.method === 'POST') {
            return this.readDataPromise.then((data) => {
                console.log('data',data)
                const newId = Math.max(...this.dbArray.map(({ id }) => id)) + 1;
                const objToCreate = { id: newId, e: JSON.parse(data) };
                this.dbArray.push(objToCreate);
                return res.end(JSON.stringify(this.dbArray[getRandomInt(1,this.dbArray.length)]));//return random obj from dbArray
            });
        }

        if (req.method === "PUT") {
            return this.readDataPromise.then((data) => {
                const { id, e } = JSON.parse(data);
                let updateObj;
                this.dbArray.map((item) => {
                    if (item.id === id) {
                        item.e = e;
                        updateObj = item;
                    }
                });
                return res.end(JSON.stringify(updateObj));
            });
        }

        if (req.method === "DELETE") {
            return this.readDataPromise.then((data) => {
                const idToRemove = JSON.parse(data);
                const indToRemove = this.dbArray.findIndex(({ id }) => id === idToRemove);
                if (indToRemove === -1) {
                    return res.end(JSON.stringify(`Element with id ${idToRemove} wasn't found`));
                }
                this.dbArray.splice(indToRemove, 1);
                return res.end(JSON.stringify(`Element with id ${idToRemove} was deleted`));
            });
        }
    }
}