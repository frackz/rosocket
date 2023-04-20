"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const express_1 = require("express");
const index_js_1 = require("../index.js");
const ws_1 = __importDefault(require("ws"));
const functions_js_1 = require("../functions.js");
exports.connect = new express_1.Router();
exports.connect.post("/connect", (req, res) => {
    let body = req.body;
    let url = body.url;
    let id = (0, functions_js_1.getId)() + 1;
    let connection;
    try {
        connection = new ws_1.default(url);
    }
    catch (err) {
        return res.json({ success: false, msg: "Error: " + err });
    }
    connection.on('open', () => {
        index_js_1.sockets[id].open = true;
        (0, functions_js_1.sendMsg)(id, { type: "open" });
    });
    connection.on('message', (data) => (0, functions_js_1.sendMsg)(id, { type: "message", data: data.toString() }));
    connection.on('error', (err) => (0, functions_js_1.sendMsg)(id, { type: "error", data: err }));
    connection.on('close', () => {
        index_js_1.sockets[id].open = false;
        connection.terminate();
        (0, functions_js_1.sendMsg)(id, { type: "close" });
    });
    index_js_1.sockets[id] = { messages: [], connection: connection, open: false };
    res.json({ success: true, id: id });
});
//# sourceMappingURL=connect.js.map