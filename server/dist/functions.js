"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = exports.getSocket = exports.clearMsg = exports.sendMsg = exports.getId = void 0;
const index_js_1 = require("./index.js");
const axios_1 = __importDefault(require("axios"));
function getId() {
    return Object.keys(index_js_1.sockets).length;
}
exports.getId = getId;
function sendMsg(id, data) {
    let messages = index_js_1.sockets[id]["messages"];
    messages.push(data);
}
exports.sendMsg = sendMsg;
function clearMsg(id) {
    index_js_1.sockets[id]["messages"] = [];
}
exports.clearMsg = clearMsg;
function getSocket(id) {
    return index_js_1.sockets[id];
}
exports.getSocket = getSocket;
function sendRequest(data, res) {
    return (0, axios_1.default)(data).then((response) => {
        res.json({
            success: true,
            status: {
                code: response.status,
                message: response.statusText
            },
            headers: response.headers,
            body: response.data
        });
    }).catch((reason) => {
        res.json({
            success: false,
            body: reason.body
        });
    });
}
exports.sendRequest = sendRequest;
//# sourceMappingURL=functions.js.map