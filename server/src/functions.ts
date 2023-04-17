import { sockets } from './index.js'
import axios from 'axios'

export const getId = () => { return Object.keys(sockets).length }
export const sendMsg = (id, data) => sockets[id]["messages"].push(data)
export const clearMsg = (id) => sockets[id]["messages"] = []
export const getSocket = (id) => { return sockets[id] }

export const sendRequest = (data, res) => {
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
    }).catch((reason) => res.json({ success: false, body: reason.body }))
}