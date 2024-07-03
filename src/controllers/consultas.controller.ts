import express from "express";
const consultas = express();


export async function getConsultas(req: express.Request, res: express.Response) {
    res.send('Hello World')
}