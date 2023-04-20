"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = require("express");
exports.Routes = (0, express_1.Router)();
const connect_js_1 = require("./connect.js");
const send_js_1 = require("./send.js");
const messages_js_1 = require("./messages.js");
const close_js_1 = require("./close.js");
exports.Routes.use(connect_js_1.connect, send_js_1.send, messages_js_1.messages, close_js_1.close);
//# sourceMappingURL=index.js.map