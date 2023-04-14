import express, { Express, Request, Response} from 'express'
import WebSocket from 'ws'

import { SendMessage, ClearMessages, SocketExist, SendRequest } from './functions.js'

export const app: Express = express();
const port: number = 8000

var currentId: number = 0
export var sockets = {}

app.use(express.json())

app.post("/connect", (req: Request, res: Response) => {
    let body = req.body
    let url = body.url

    currentId += 1

    let id = currentId.toString()
    let connection = new WebSocket(url)
    
    connection.on('open', () => SendMessage(id, { type: "open" }))
    connection.on('message', (data) => SendMessage(id, { type: "message", data: data.toString() }))
    connection.on('error', (err) => SendMessage(id, { type: "error", data: err }))
    connection.on('close', () => SendMessage(id, { type: "close" }))

    sockets[id] = { messages: [], connection: connection }

    res.send(id)
})

app.post("/send", (req: Request, res: Response) => {
    let body = req.body

    let [id, message, type, request] = [body.id, body.message, body.type, body.data]

    if (type != "request" && type != "socket") return res.json({ success: false, msg: "Cannot read type" })   
    if (type == "request") return SendRequest(request, res)
    
    let socket = sockets[id]

    if (!SocketExist(id)) return res.json({success: false, msg: "Invalid socket"})
    
    let connection = socket.connection
    connection.send(message)

    res.json({ success: true })
})

app.get('/messages', (req: Request, res: Response) => {
    let body = req.query
    let id: string = body.id

    if (!SocketExist(id)) return res.json({ success: false, msg: "Invalid socket" })
    
    let messages: Array<Object> = sockets[id]["messages"]

    res.json({
        success: true,
        data: messages
    })

    ClearMessages(id)
})

app.listen(port, () => { console.log("Running rosocket") })