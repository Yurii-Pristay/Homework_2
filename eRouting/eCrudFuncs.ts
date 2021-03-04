import { dbObject } from '../interfaces';

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export  class ECrudFuncs {
    private readonly dbArray: Array<dbObject>;
    private readonly readDataPromise: Promise<string>;
    req: any;
    res: any;

    constructor(dbArray: Array<dbObject>, req, res) {
        this.dbArray = dbArray;
        this.req = req;
        this.res = res;
        this.readDataPromise = new Promise((resolve, reject) => {//promise which often used
            let data = '';
            req.on('data', (chunk: { toString: () => string; }) => (data += chunk.toString()));
            req.on('end', () => resolve(data));
        });
    }

    read() { 
        if (this.req.url.includes("?persantage=true")) {//params wich need to show percentage
            let percentage = this.dbArray.filter(item => item.e === true).length / this.dbArray.filter(item => item.e === false).length;
            return this.res.end(JSON.stringify(percentage * 100) + "% true to false",);
        } else {
            return this.res.end(JSON.stringify(this.dbArray.filter(({ e }) => e)));
        }
    }

    create() {
        return this.readDataPromise.then((data) => {
            console.log('data', data)
            const newId = Math.max(...this.dbArray.map(({ id }) => id)) + 1;
            const objToCreate: dbObject = { id: newId, e: JSON.parse(data) };
            this.dbArray.push(objToCreate);
            return this.res.end(JSON.stringify(this.dbArray[getRandomInt(1, this.dbArray.length)]));
        });
    }

    update() {
        return this.readDataPromise.then((data) => {
            const { id, e } = JSON.parse(data);
            let updateObj;
            this.dbArray.map((item) => {
                if (item.id === id) {
                    item.e = e;
                    updateObj = item;
                }
            });
            return this.res.end(JSON.stringify(updateObj));
        });
    };

    delte() {
        return this.readDataPromise.then((data) => {
            const idToRemove = JSON.parse(data);
            const indToRemove = this.dbArray.findIndex(({ id }) => id === idToRemove);
            if (indToRemove === -1) {
                return this.res.end(JSON.stringify(`Element with id ${idToRemove} wasn't found`));
            }
            this.dbArray.splice(indToRemove, 1);
            return this.res.end(JSON.stringify(`Element with id ${idToRemove} was deleted`));
        });
    }

}