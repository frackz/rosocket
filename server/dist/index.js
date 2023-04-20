"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sockets = void 0;
const express_1 = __importDefault(require("express"));
const index_js_1 = require("./routes/index.js");
const app = (0, express_1.default)();
const port = 8000;
exports.sockets = {};
app.use(express_1.default.json());
app.use('/', index_js_1.Routes);
app.listen(port, () => { console.log("Started server on port " + port); });
//# sourceMappingURL=index.js.map