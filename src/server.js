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
const cors_1 = __importDefault(require("cors"));
const transcribe_1 = require("./transcribe");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Transcription.ai Express Server Running!");
}));
app.post("/submit", handleSubmit);
function handleSubmit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { link } = req.body;
        if (!link)
            res.status(500).send("Link not provided!");
        console.log("Received link: ", link);
        try {
            const result = yield (0, transcribe_1.transcribe)(link);
            console.log("result.text", result.text);
            res.send(result);
        }
        catch (error) {
            console.error('Error in processing the request:', error);
            res.status(500).send({ error: 'An error occurred while processing your request. Please try again later.' });
        }
    });
}
app.listen(PORT, () => {
    console.log(`[server]: Server is running on ${PORT}`);
});
