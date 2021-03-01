const url = require("url");

module.exports = class CrudSystem {
  dbArray;

  constructor(dbArray, req) {
    this.dbArray = dbArray;
    this.readBufferPromise = new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk.toString()));
      req.on("end", () => resolve(data));
    });
  }

  create(res) {
    return this.readBufferPromise.then((data) => {
      const newId = Math.max(...this.dbArray.map(({ id }) => id)) + 1;
      const objToCreate = { id: newId, b: { key: data } };
      this.dbArray.push(objToCreate);
      return res.end(JSON.stringify(objToCreate));
    });
  }

  read(req, res) {
    const { page, pageCount, id } = url.parse(req.url, true).query;
    const paginationPage = {
      page: page,
      pageCount: pageCount,
      data: this.dbArray.find((item) => item.id === +id) || 'Not found',
    };
    return res.end(JSON.stringify(paginationPage));
  }

  update(res) {
    return this.readBufferPromise.then((data) => {
      const { id, b } = JSON.parse(data);
      this.dbArray = this.dbArray.map((item) => {
        if (item.id === id) {
          item.b = b;
        }
        return item;
      });

      return res.end(JSON.stringify(this.dbArray));
    });
  }

  delete(res) {
    return this.readBufferPromise.then((data) => {
      const { id } = JSON.parse(data);
      this.dbArray = this.dbArray.filter((item) => {
        return item.id !== id;
      });

      return res.end(JSON.stringify(this.dbArray));
    });
  }
};
