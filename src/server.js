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
const axios_1 = __importDefault(require("axios"));
const transcribe_1 = require("./transcribe");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const SIEVE_API_KEY = process.env.SIEVE_API_KEY;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// endpoints
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Ready to run!");
}));
app.post("/submit", handleSubmit);
app.post('/transcribe', handleTranscribe);
app.get('/check-status/:jobId', handleCheckStatus);
app.listen(PORT, () => {
    console.log(`[server]: Server is running on ${PORT}`);
});
function handleSubmit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { link } = req.body;
        try {
            const { text, summary, title, tags, chapters } = yield (0, transcribe_1.transcribe)(link);
            res.send({ text, summary, title, tags, chapters });
        }
        catch (error) {
            console.error('Error in processing the request:', error);
            res.status(500).send({ error: 'An error occurred while processing your request. Please try again later.' });
        }
    });
}
function handleTranscribe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { link } = req.body;
        try {
            const response = yield axios_1.default.post('https://mango.sievedata.com/v2/push', {
                function: "sieve/speech_transcriber",
                inputs: {
                    file: { url: link }
                }
            }, {
                headers: { 'X-API-Key': SIEVE_API_KEY }
            });
            const jobId = response.data.id;
            res.send(jobId);
        }
        catch (error) {
            res.status(500).send('Error during transcription');
        }
    });
}
function handleCheckStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobId = req.params.jobId;
        try {
            const response = yield axios_1.default.get(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
                headers: { 'X-API-Key': SIEVE_API_KEY }
            });
            const jobStatus = response.data.status;
            if (jobStatus === 'finished' && response.data.outputs) {
                const transcripts = response.data.outputs.map((output) => output.data.map(item => item.text));
                res.json({ transcripts });
            }
            else {
                res.json({ status: jobStatus });
            }
        }
        catch (error) {
            res.status(500).send('Error retrieving job status');
        }
    });
}
