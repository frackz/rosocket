"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const express_1 = require("express");
const functions_js_1 = require("../functions.js");
exports.send = new express_1.Router();
exports.send.post("/send", (req, res) => {
    let body = req.body;
    let [id, message, type, request] = [body.id, body.message, body.type, body.data];
    if (type != "request" && type != "socket")
        return res.json({ success: false, msg: "Cannot read type" });
    if (type == "request")
        return (0, functions_js_1.sendRequest)(request, res);
    let socket = (0, functions_js_1.getSocket)(id);
    if (!socket)
        return res.json({ success: false, msg: "Invalid Socket" });
    if (message == null)
        return res.json({ success: false, msg: "Invalid Message" });
    let connection = socket.connection;
    if (socket.open)
        connection.send(message);
    else
        connection.on('open', () => {
            connection.send(message);
        });
    res.json({ success: true });
});
//# sourceMappingURL=send.js.map