import { ECrudFuncs } from './eCrudFuncs';
import { dbObject } from '../interfaces';

export function eRouter(dbArray: Array<dbObject>, req, res): void {
    const e = new ECrudFuncs(dbArray, req, res)
    if (req.method === "GET") {
        e.read();
    } else if (req.method === "POST") {
        e.create();
    } else if (req.method === "PUT") {
        e.update();
    } else if (req.method === "DELETE") {
        e.delte();
    }
}