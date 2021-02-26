const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const dbArray = [
  { id: 1, a: [1, 2, 3] },
  { id: 2, b: { key: 'test' } },
  { id: 3, c: 123 },
  { id: 4, d: 'test' },
  { id: 5, e: true },
]; // updating and deleting by id

const server = http.createServer((req, res) => {
  // req.method -- get method
  // req.url -- get url
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/a' && req.method === 'GET') {
    return res.end(JSON.stringify(dbArray.filter(({ a }) => a)));
  }
  if (req.url === '/a' && req.method === 'POST') {
    // req.body
    return new Promise((res, rej) => {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => res(data));
    }).then((res1) => {
      const newId = Math.max(...dbArray.map(({ id }) => id)) + 1;
      const { a } = JSON.parse(res1);
      const objToCreate = { id: newId, a };
      dbArray.push(objToCreate);

      return res.end(JSON.stringify(objToCreate));
    });
  }
  if (req.url === '/a' && req.method === 'PUT') {
    return new Promise((res, rej) => {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => res(data));
    }).then((res1) => {
      const { a, id: idft } = JSON.parse(res1);
      const foundObject = dbArray.find(({ id }) => id === idft);
      foundObject.a = a;

      return res.end(JSON.stringify(foundObject));
    });
  }
  if (req.url === '/a' && req.method === 'DELETE') {
    return new Promise((res, rej) => {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => res(data));
    }).then((res1) => {
      const { id } = JSON.parse(res1);
      const foundIndex = dbArray.findIndex(({ id }) => id === idft);
      delete dbArray[foundIndex]; // don't do like this!

      return res.end(JSON.stringify(foundObject));
    });
  }

  return res.end('Hello, World!\n');
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
