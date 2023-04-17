import { Request, Response, Router } from 'express';
import { sockets } from '../index.js';

import WebSocket from 'ws'

import { sendMsg, getId } from '../functions.js'

export const connect = new Router()

connect.post("/connect", (req: Request, res: Response) => {
    let body = req.body
    let url = body.url

    let id = getId() + 1
    let connection

    try {
        connection = new WebSocket(url)
    } catch(err) {
        return res.json({success: false, msg: "Error: "+err})
    }
    
    connection.on('open', () => {
        sockets[id].open = true
        sendMsg(id, { type: "open" })
    })

    connection.on('message', (data) => sendMsg(id, { type: "message", data: data.toString() }))
    connection.on('error', (err) => sendMsg(id, { type: "error", data: err }))
    connection.on('close', () => {
        sockets[id].open = false
        connection.terminate()

        sendMsg(id, { type: "close" })
    })

    sockets[id] = { messages: [], connection: connection, open: false }
    res.json({success: true, id: id})
})