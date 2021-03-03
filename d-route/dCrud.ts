import { dbObject, dObject } from "../interfaces";

const isCamelCase = (msg: string) => /[A-Z]/.test(msg.substring(1));

const camelToSnake = (msg: string) => {
  return msg.replace(/([a-z\d])([A-Z])/g, "$1_$2").toLowerCase();
};

const isPalindrome = (msg: string) => {
  return msg == msg.split("").reverse().join("");
};

export class DCrud {
  private readonly readBufferPromise: Promise<string>;
  private readonly dbArray: Array<dbObject>;

  constructor(dbArray, req) {
    this.dbArray = dbArray;
    this.readBufferPromise = new Promise<string>((resolve, reject) => {
      let data = "";

      req
        .on("data", (chunk) => (data += chunk.toString()))
        .on("end", () => resolve(data));
    });
  }

  read(req, res) {
    let dArray = this.dbArray.filter(({ d }) => d);

    if (req.url.includes("isPalindrome=true")) {
      const dArrayPalindrome = dArray.map((item) => {
        let newItem: dObject = JSON.parse(JSON.stringify(item));
        newItem.isPalindrome = isPalindrome(item.d);
        return newItem;
      });

      return res.end(JSON.stringify(dArrayPalindrome));
    }

    return res.end(JSON.stringify(dArray));
  }

  create(req, res) {
    return this.readBufferPromise.then((data) => {
      const newId = Math.max(...this.dbArray.map(({ id }) => id)) + 1;
      let { d } = JSON.parse(data);
      d = isCamelCase(d) ? camelToSnake(d) : d;
      const objToCreate: dObject = { id: newId, d };

      this.dbArray.push(objToCreate);
      return res.end(JSON.stringify(objToCreate));
    });
  }

  update(req, res) {
    return this.readBufferPromise.then((data) => {
      const bodyObj: dObject = JSON.parse(data);
      const objToChange: dbObject = this.dbArray.find(
        (item) => item.id === bodyObj.id && item.d
      );
      if (!objToChange) {
        return res.end(JSON.stringify("Bad input values(either ID or D)"));
      }
      (objToChange as dObject).d = bodyObj.d;

      return res.end(JSON.stringify(objToChange));
    });
  }

  delete(req, res) {
    return this.readBufferPromise.then((data) => {
      const bodyObj: dObject = JSON.parse(data);
      const indToRemove = this.dbArray.findIndex(
        (item) => item.id === bodyObj.id && item.d
      );

      if (indToRemove === -1) {
        return res.end(
          JSON.stringify("No ID value given / No object with such ID")
        );
      }
      this.dbArray.splice(indToRemove, 1);

      return res.end(JSON.stringify("Object successfully deleted"));
    });
  }
}
