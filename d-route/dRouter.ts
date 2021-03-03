import { DCrud } from "./dCrud";
import { dbObject } from "../interfaces";

export function dRoute(req, res, dbArray: Array<dbObject>): void {
  const d = new DCrud(dbArray, req);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (req.method === "GET") {
    d.read(req, res);
  } else if (req.method === "POST") {
    d.create(req, res);
  } else if (req.method === "PUT") {
    d.update(req, res);
  } else if (req.method === "DELETE") {
    d.delete(req, res);
  }
}
