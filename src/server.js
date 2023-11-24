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
const sieveService_1 = require("./sieveService");
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
        if (!link) {
            res.status(500).send("Link not provided!");
            return;
        }
        console.log("Received link: ", link);
        const jobId = yield (0, transcribe_1.transcribe)(link);
        let status = 'processing';
        let data;
        while (status === 'processing') {
            const response = yield (0, sieveService_1.fetchSieveData)(jobId);
            status = response.status;
            data = response.data;
            if (status === 'processing') {
                yield new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        console.log("Output: ", data);
        res.send(data);
    });
}
app.get("/jobs/:jobId", handleFetchJob);
function handleFetchJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobId = req.params.jobId;
            if (!jobId) {
                return res.status(400).json({ error: 'Missing jobId' });
            }
            const jobResult = yield (0, sieveService_1.fetchSieveData)(jobId);
            if (jobResult.data === "processing") {
                return res.status(503).json({ error: "Processing, outputs not ready yet..." });
            }
            return res.status(200).json(jobResult);
        }
        catch (error) {
            console.error('Error fetching job:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
app.listen(PORT, () => {
    console.log(`[server]: Server is running on ${PORT}`);
});
