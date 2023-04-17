import { Request, Response, Router } from 'express';

import WebSocket from 'ws'

import { getSocket, sendRequest } from '../functions.js'

export const send = new Router()

send.post("/send", (req: Request, res: Response) => {
    let body = req.body
    let [id, message, type, request] = [body.id, body.message, body.type, body.data]

    if (type != "request" && type != "socket")
        return res.json({ success: false, msg: "Cannot read type" })

    if (type == "request")
        return sendRequest(request, res)
    
    let socket = getSocket(id)

    if (!socket) return res.json({success: false, msg: "Invalid Socket"})
    if (message == null) return res.json({success: false, msg: "Invalid Message"})

    let connection: WebSocket = socket.connection

    if (socket.open) connection.send(message)
    else connection.on('open', () => {
        connection.send(message)
    })

    res.json({ success: true })
})