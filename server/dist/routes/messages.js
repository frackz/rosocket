"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
const express_1 = require("express");
const functions_js_1 = require("../functions.js");
const index_js_1 = require("../index.js");
exports.messages = new express_1.Router();
exports.messages.get("/messages", (req, res) => {
    let body = req.query;
    let id = body.id;
    if (id == null) { // Return all socket messages
        let messages = {};
        for (const key in index_js_1.sockets) {
            let value = (0, functions_js_1.getSocket)(key);
            messages[key] = value.messages;
            (0, functions_js_1.clearMsg)(key);
        }
        return res.json(messages);
    }
    let socket = (0, functions_js_1.getSocket)(id);
    if (!socket)
        return res.json({ success: false, msg: "Invalid socket" });
    let messages = socket.messages;
    res.json({ success: true, data: messages });
    (0, functions_js_1.clearMsg)(id);
});
//# sourceMappingURL=messages.js.map