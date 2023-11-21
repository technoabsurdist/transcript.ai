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
exports.getYoutubeVideoTitle = exports.transcribe = void 0;
const fs_1 = __importDefault(require("fs"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
function transcribe(link) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputFileName = 'output.mp3';
        try {
            yield downloadAudio(link, outputFileName);
            return yield transcribeAudio(outputFileName);
        }
        catch (error) {
            console.error('Error in download and transcription process:', error);
            return null;
        }
    });
}
exports.transcribe = transcribe;
function getYoutubeVideoTitle(link) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const videoInfo = yield ytdl_core_1.default.getInfo(link);
            return videoInfo.videoDetails.title;
        }
        catch (error) {
            console.error('Error fetching YouTube video info:', error);
            return null;
        }
    });
}
exports.getYoutubeVideoTitle = getYoutubeVideoTitle;
// helpers
function downloadAudio(link, outputFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (0, ytdl_core_1.default)(link, { filter: 'audioonly' })
                .pipe(fs_1.default.createWriteStream(outputFileName))
                .on('finish', resolve)
                .on('error', reject);
        });
    });
}
function transcribeAudio(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transcription = yield openai.audio.transcriptions.create({
                file: fs_1.default.createReadStream(file),
                model: "whisper-1"
            });
            return transcription.text;
        }
        catch (error) {
            console.error('Error transcribing the file:', error);
            return null;
        }
    });
}
