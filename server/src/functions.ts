import { sockets } from './index.js'
import axios from 'axios'

export function getId() {
    return Object.keys(sockets).length
}

export function sendMsg(id, data) {
    let messages: Array<Object> = sockets[id]["messages"]

    messages.push(data)
}

export function clearMsg(id) {
    sockets[id]["messages"] = []
}

export function getSocket(id) {
    return sockets[id]
}

export function sendRequest(data, res) {
    return axios(data).then((response) => {
        res.json({
            success: true,
            status: {
                code: response.status,
                message: response.statusText
            },
            headers: response.headers,
            body: response.data
        })
    }).catch((reason) => {
        res.json({
            success: false,
            body: reason.body
        })
    })
}