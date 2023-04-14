import { sockets, currentId } from './index.js'
import axios from 'axios'

export function SendMessage(id, data) {
    let messages: Array<Object> = sockets[id]["messages"]

    messages.push(data)
}

export function ClearMessages(id) {
    sockets[id]["messages"] = []
}

export function GetSocket(id) {
    return sockets[id]
}

export function SendRequest(data, res) {
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