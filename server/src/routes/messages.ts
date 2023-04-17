import { Request, Response, Router } from 'express';

import { clearMsg, getSocket } from '../functions.js'
import { sockets } from '../index.js';

export const messages = new Router()

messages.get("/messages", (req: Request, res: Response) => {
    let body = req.query
    let id: string = body.id

    if (id == null) { // Return all socket messages
        let messages = {}
        for (const key in sockets) {
            messages[key] = getSocket(key).messages

            clearMsg(key)
        }

        return res.json(messages)
    }

    let socket = getSocket(id)
    if (!socket) return res.json({ success: false, msg: "Invalid socket" })
    
    let messages: Array<Object> = socket.messages
    res.json({ success: true, data: messages })

    clearMsg(id)
})