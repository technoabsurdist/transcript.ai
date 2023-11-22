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
exports.transcribeAudio = exports.downloadAudio = void 0;
const fs_1 = __importDefault(require("fs"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
function downloadAudio(link, outputFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (0, ytdl_core_1.default)(link, { filter: 'audioonly' })
                .pipe(fs_1.default.createWriteStream(outputFileName))
                .on('finish', resolve)
                .on('error', (error) => reject(new Error(`Download error: ${error.message}`)));
        });
    });
}
exports.downloadAudio = downloadAudio;
// Deprecated: Whisper1 (No longer using whisper directly)
function transcribeAudio(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const transcription = yield openai.audio.transcriptions.create({
            file: fs_1.default.createReadStream(file),
            model: "whisper-1"
        });
        return transcription.text;
    });
}
exports.transcribeAudio = transcribeAudio;
