import express, { Express, Request, Response} from 'express'
import WebSocket from 'ws'

import { SendMessage, ClearMessages, SendRequest, GetSocket } from './functions.js'

export const app: Express = express();
const port: number = 8000

export var currentId: number = 0
export var sockets: Object = {}

app.use(express.json())

app.post("/connect", (req: Request, res: Response) => {
    let body = req.body
    let url = body.url

    currentId += 1

    let id = currentId.toString()
    let connection = new WebSocket(url)
    
    connection.on('open', () => {
        sockets[id].open = true
        SendMessage(id, { type: "open" })
    })

    connection.on('message', (data) => SendMessage(id, { type: "message", data: data.toString() }))
    connection.on('error', (err) => SendMessage(id, { type: "error", data: err }))
    connection.on('close', () => {
        sockets[id].open = false
        connection.terminate()

        SendMessage(id, { type: "close" })
    })

    sockets[id] = { messages: [], connection: connection, open: false }

    res.send(id)
})

app.post("/send", (req: Request, res: Response) => {
    let body = req.body
    let [id, message, type, request] = [body.id, body.message, body.type, body.data]

    if (type != "request" && type != "socket")
        return res.json({ success: false, msg: "Cannot read type" })

    if (type == "request")
        return SendRequest(request, res)
    
    let socket = GetSocket(id)

    if (!socket) return res.json({success: false, msg: "Invalid Socket"})
    if (message == null) return res.json({success: false, msg: "Invalid Message"})

    let connection: WebSocket = socket.connection

    if (socket.open) connection.send(message)
    else connection.on('open', () => {
        connection.send(message)
    })

    res.json({ success: true })
})

app.get('/messages', (req: Request, res: Response) => {
    let body = req.query
    let id: string = body.id

    if (id == null) { // Return all socket messages
        let messages = {}
        for (const key in sockets) {
            let value = GetSocket(key)
            messages[key] = value.messages

            ClearMessages(key)
        }

        return res.json(messages)
    }

    let socket = GetSocket(id)
    if (!socket) return res.json({ success: false, msg: "Invalid socket" })
    
    let messages: Array<Object> = socket.messages
    res.json({ success: true, data: messages })

    ClearMessages(id)
})

app.post('/close', (req: Request, res: Response) => {
    let body = req.body
    let id: string = body.id

    let socket = GetSocket(id)

    if (!socket) return res.json({ success: false, msg: "Invalid socket" })
    if (!socket.open) return res.json({ success: false, msg: "Socket is already closed" })

    let connection: WebSocket = socket.connection

    connection.terminate()
    res.json({ success: true })
})

app.listen(port, () => { console.log("Started server on port "+port) })