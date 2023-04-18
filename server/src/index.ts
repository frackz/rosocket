import express, { Express } from 'express'

import { Routes } from './routes/index.js'

const app: Express = express();
const port: number = 8000

export var sockets: Object = {}

app.use(express.json())
app.use('/', Routes)

app.listen(port, () => console.log("Started server on port "+port))