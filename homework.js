const http = require('http');

const DCrud = require('./dCrud');
const ECrud = require('./eRouting')

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
  try{ 

    console.log(asdl); // try to call some error


    // d route
    if (req.url === '/d' || req.url.startsWith('/d?')) {
      const d = new DCrud(dbArray, req);
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });

      if (req.method === 'GET') {
        d.read(req, res);
      } else if (req.method === 'POST') {
        d.create(req, res);
      } else if (req.method === 'PUT') {
        d.update(req, res);
      } else if (req.method === 'DELETE') {
        d.delete(req, res);
      }
    }

    // e routing
    if (req.url === '/e' || req.url.startsWith('/e?')) {
      res.writeHead(200, { 'Content-Type': 'application/json', })
      const e = new ECrud(dbArray, req)
      e.routing(req,res)
    }
  }
  catch(e){
    console.log(e);
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    res.end("server`s malformed");
  }
  
  
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});





