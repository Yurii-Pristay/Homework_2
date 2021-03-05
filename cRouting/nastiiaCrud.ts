
//                EXAMPLE

import { dbObject } from "../interfaces";


type cRoute = {
    id: number,
    c: number
}

module.exports = class cCRUD{
    arr: Array <dbObject> ;
    promise: Promise <string>;
    
    constructor(arr: Array <dbObject>,req){ 
        this.arr=arr;
        this.promise = new Promise((res,rej) =>{

            let data = '';

            req.on('data', (chunk) => {data += chunk});
            
            req.on('end', () => res(data));
        })  
    }

    read(req,res){
        return res.end(JSON.stringify(this.arr.filter(({ c }) => c)));
    }

    create(req,res){
        return this.promise.then((newData) => {
            // do i need to check for type of c in ts????

            // const newObj: cRoute = JSON.parse(newData);

            // const  c:number =  newObj.c as number;

            // //console.log("type of c:",typeof(c));

            // const newId = Math.max(...this.arr.map(({ id }) => id)) + 1;
            // const objToCreate:dbObject = { id: newId, c };
            
            // this.arr.push(objToCreate);

            // //console.log(this.arr);
            // return res.end(JSON.stringify(objToCreate));
            
            const { c } = JSON.parse(newData);
            //console.log(c);

            if (typeof(c) !== 'number'){ // do i need this to check in ts????
                
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify("400 BadRequest"));

                throw new Error("Your data is invalid!");
                
            }

            else{
                const newId = Math.max(...this.arr.map(({ id }) => id)) + 1;
                const objToCreate: cRoute = { id: newId, c };
                this.arr.push(objToCreate);

                //console.log(this.arr);
                return res.end(JSON.stringify(objToCreate));
            }
            
        });
    }

    update(req,res){
        return this.promise.then((newData) => {

            const {  c, id: idft} = JSON.parse(newData);

            //console.log("newData : ",newData);

            const foundObject:dbObject = this.arr.find(({id}) => id === idft);
            if(!foundObject ){

                return res.end(JSON.stringify("Your id is invalid"));
               
            }
            foundObject .c = c;
      
            //console.log(this.arr);
            return res.end(JSON.stringify(foundObject));
          });
    }

    delete(req,res){
        return this.promise.then((item) => {

            const { id } = JSON.parse(item);

            //console.log("Id to delete: ", id);
            const foundIndex = this.arr.findIndex((data) => data.id === id );
            if( foundIndex === -1 ){

                return res.end(JSON.stringify("Your id is invalid"));
               
            }
            this.arr.splice(foundIndex,1);
      
            //console.log(this.arr);
            return res.end(JSON.stringify(foundIndex));
          });
    }

}
