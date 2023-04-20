"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = void 0;
const express_1 = require("express");
const functions_js_1 = require("../functions.js");
exports.close = new express_1.Router();
exports.close.post("/close", (req, res) => {
    let body = req.body;
    let id = body.id;
    let socket = (0, functions_js_1.getSocket)(id);
    if (!socket)
        return res.json({ success: false, msg: "Invalid socket" });
    if (!socket.open)
        return res.json({ success: false, msg: "Socket is already closed" });
    let connection = socket.connection;
    connection.terminate();
    res.json({ success: true });
});
//# sourceMappingURL=close.js.map