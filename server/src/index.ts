import express, { Express, Request, Response} from 'express'
import WebSocket from 'ws'
import axios from 'axios'

import { SendMessage, ClearMessages } from './functions.js'

const app: Express = express();
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
    
    connection.on('open', () => {
        SendMessage(id, {
            type: "open"
        })
    })

    connection.on('message', (data) => {
        SendMessage(id, {
            type: "message",
            data: data.toString()
        })
    })

    connection.on('error', (err) => {
        SendMessage(id, {
            type: "error",
            data: err
        })
    })

    connection.on('close', () => {
        SendMessage(id, {
            type: "close"
        })
    })

    sockets[id] = {
        messages: [],
        connection: connection
    }

    res.send(id)
})

app.post("/send", (req: Request, res: Response) => {
    let body = req.body

    let [type, data] = [body.type, body.data]

    if (type != "request" && type != "socket") {
        return res.json({
            success: false
        })
    }
    
    if (type == "request") {
        axios(data).then((response) => {
            res.json({
                error: false,
                status: {
                    code: response.status,
                    message: response.statusText
                },
                headers: response.headers,
                body: response.data
            })
        }).catch((reason) => {
            res.json({
                error: true,
                msg: reason.body
            })
        })
    } else if (type == "socket") {
        let [id, message] = [data.id, data.message]
        let socket = sockets[id]

        if (!id || !socket) {
            let connection: WebSocket = socket.connection

            connection.send(message)
        }
    }
})

app.get('/messages', (req: Request, res: Response) => {
    let body = req.query
    let id: string = body.id

    if (!id || !sockets[id]) {
        return res.json({
            success: false
        })
    }

    let messages: Array<Object> = sockets[id]["messages"]

    res.json({
        success: true,
        data: messages
    })

    messages = []
    ClearMessages(id)
})

app.listen(port, () => { console.log("Running rosocket") })