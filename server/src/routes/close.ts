import { Request, Response, Router } from 'express';

import WebSocket from 'ws'

import { getSocket } from '../functions.js'

export const close = new Router()

close.post("/close", (req: Request, res: Response) => {
    let body = req.body
    let id: string = body.id

    let socket = getSocket(id)

    if (!socket) return res.json({ success: false, msg: "Invalid socket" })
    if (!socket.open) return res.json({ success: false, msg: "Socket is already closed" })

    let connection: WebSocket = socket.connection

    connection.terminate()
    res.json({ success: true })
})