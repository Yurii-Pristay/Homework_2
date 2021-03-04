import * as http from "http";

import { dbObject } from "./interfaces";

// const CrudForARoute = require("./CrudForARoute");
// const CrudSystem = require("./CrudSystem");
// const CCrud = require("./nastiiaCrud");
import { dRoute } from "./d-route/dRouter";
import { eRouter } from "./eRouting/eRouter";

const hostname = "127.0.0.1";
const port = 3000;

const dbArray: Array<dbObject> = [
  { id: 1, a: [1, 2, 3] },
  { id: 2, b: { key: "test" } },
  { id: 3, c: 123 },
  { id: 4, d: "test" },
  { id: 5, e: true },
]; // updating and deleting by id

const server = http.createServer((req, res) => {
  // req.method -- get method
  // req.url -- get url
  try {
    //console.log(asdl); // try to call some error

    //a route
    // if (req.url === "/a"  || req.url.startsWith("/a?")) {
    //   const a = new CrudForARoute(dbArray,req);
    //   res.writeHead(200, {
    //     "Content-Type": "application/json",
    //   });

    //   if (req.method === "POST") {
    //     a.POST(req, res);
    //   } else if (req.method === "PUT") {
    //     a.PUT(req,res);
    //   } else if (req.method === "DELETE") {
    //     a.DELETE(req, res);
    //   } else if (req.method === "GET") {
    //     a.GET(req,res);
    //   }
    // }

    // // b route
    // if (req.url === "/b" || req.url.startsWith("/b?")) {
    //   const b = new CrudSystem(dbArray,req);
    //   res.writeHead(200, {
    //     "Content-Type": "application/json",
    //   });

    //   if (req.method === "GET") {
    //     b.read(req, res);
    //   } else if (req.method === "POST") {
    //     b.create(res);
    //   } else if (req.method === "PUT") {
    //     b.update(res);
    //   } else if (req.method === "DELETE") {
    //     b.delete(res);
    //   }
    // }

    // d route
    if (req.url === "/d" || req.url.startsWith("/d?")) {
      dRoute(req, res, dbArray);
    }
    // e routing
    if (req.url === "/e" || req.url.startsWith("/e?")) {
      eRouter(dbArray,req,res);
    }

    // c CRUD

    //   if (req.url === "/c" || req.url.startsWith("/c?")) {
    //     const c = new CCrud(dbArray, req);
    //     res.writeHead(200, {
    //       "Content-Type": "application/json",
    //     });

    //     if (req.method === "GET") {
    //       c.read(req, res);
    //     } else if (req.method === "POST") {
    //       c.create(req, res);
    //     } else if (req.method === "PUT") {
    //       c.update(req, res);
    //     } else if (req.method === "DELETE") {
    //       c.delete(req, res);
    //     }
    //   }
  } catch (e) {
    console.log(e);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end("server`s malformed");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
