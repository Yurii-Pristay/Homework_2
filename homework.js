const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const dbArray = [{ id: 1, a: [1, 2, 3 ] }, { id: 2, b: { key: 'test' }}, { id: 3, c: 123 }, { id: 4, d: 'test' }, { id: 5, e: true }]; // updating and deleting by id

const server = http.createServer((req, res) => {
  // req.method -- get method
  // req.url -- get url
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
