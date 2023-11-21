"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("./helpers");
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Ready to run!");
}));
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link } = req.body;
    try {
        const text = yield (0, helpers_1.transcribe)(link);
        const title = yield (0, helpers_1.getYoutubeVideoTitle)(link);
        res.send({ "text": text, "title": title });
    }
    catch (error) {
        console.error('Error in processing the request:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}));
app.listen(config_1.config.server.port, () => {
    return console.log(`[server]: Server is running on ${config_1.config.server.port}`);
});
