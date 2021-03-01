// const dataValid = (data)=>{
//     if (typeof(data)!=='number'){

//     }
// }

module.exports=class cCRUD{
    constructor(arr,req){
        this.arr=arr;
        this.promise = new Promise((res,rej) =>{

            let data = '';

            req.on('data', chunk => {data += chunk});

            console.log(data);
            
            req.on('end', () => res(data));
        })  
    }

    create(req,res){
        return this.promise.then((newData) => {

            const { c } = JSON.parse(newData);

            console.log(c);

            if (typeof(c) !== 'number'){
                
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify("400 BadRequest"));

                throw new Error("Your data is invalid!");
                
            }

            else{
                const newId = Math.max(...this.arr.map(({ id }) => id)) + 1;
                //const { c } = JSON.parse(newData);
                const objToCreate = { id: newId, c };
                this.arr.push(objToCreate);

                console.log(this.arr);
                return res.end(JSON.stringify(objToCreate));
            }
            
        });
    }



    read(req,res){
        return res.end(JSON.stringify(this.arr.filter(({ c }) => c)));
    }

    update(req,res){
        return this.promise.then((newData) => {
            const {  c, id: idft} = JSON.parse(newData);

            console.log("newData : ",newData);

            const foundObject = this.arr.find(({id}) => id === idft);
            if(!foundObject ){

                return res.end(JSON.stringify("Your id is invalid"));
               
            }
            foundObject.c = c;
      
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