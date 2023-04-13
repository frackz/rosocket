import express, { Express, Request, Response} from 'express'
import WebSocket from 'ws'
import axios from 'axios'

const app: Express = express();
const port: number = 8000

var currentId = 0
var sockets = {}

const sendMessage = (id, data) => {
    let messages: Array<Object> = sockets[id]["messages"]

    messages.push(data)
}

app.use(express.json())

app.post("/connect", (req: Request, res: Response) => {
    let body = req.body
    let url = body.url

    currentId += 1
    let id = currentId.toString()
    let connection = new WebSocket(url)
    
    connection.on('open', () => {
        console.log("OPEN")
    })

    connection.on('message', (data) => {
        sendMessage(id, {
            type: "message",
            data: data.toString()
        })
        console.log('received: %s', data)
    })

    connection.on('error', (err) => {

    })

    connection.on('close', () => {
        
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

    if (type == "request") {
        axios(data).then((response) => {
            res.send({
                error: false,
                status: {
                    code: response.status,
                    message: response.statusText
                },
                headers: response.headers,
                body: response.data
            })
        }).catch((reason) => {
            res.send({
                error: true,
                msg: reason.body
            })
        })
    } else if (type == "socket") {

    }
})

app.get('/messages', (req: Request, res: Response) => {
    let body = req.query
    console.log(body)
    let id = body.id
    console.log(id)
    let messages: Array<Object> = sockets[id]["messages"]

    res.send(messages)
    sockets[id]["messages"] = []
})

app.listen(port, () => {
    console.log("Running rosocket")
})
