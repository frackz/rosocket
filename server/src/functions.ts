import { sockets } from './index.js'

export function SendMessage(id, data) {
    let messages: Array<Object> = sockets[id]["messages"]

    messages.push(data)
}

export function ClearMessages(id) {
    sockets[id]["messages"] = []
}