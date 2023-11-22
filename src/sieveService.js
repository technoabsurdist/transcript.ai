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
exports.fetchSieveData = exports.processVideoSieve = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const storage = new storage_1.Storage({});
// const storage = new Storage({
//     credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "")
// });
function processVideoSieve(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileContent = fs_1.default.readFileSync(file);
            const bucketName = 'sieve-transcription';
            const fileName = `output-${(0, uuid_1.v4)()}.mp4`;
            console.log(">>> Uploading file to google cloud storage...");
            const fileUrl = yield uploadToCloudStorage(fileContent, bucketName, fileName);
            const response = yield axios_1.default.post('https://mango.sievedata.com/v2/push', {
                function: "sieve/video_transcript_analyzer",
                inputs: {
                    file: { url: fileUrl },
                    generate_chapters: true,
                    max_summary_length: 20,
                    max_title_length: 10,
                    num_tags: 5
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.SIEVE_API_KEY
                }
            });
            return { jobId: response.data.id };
        }
        catch (error) {
            console.log(error);
            throw new Error("Unable to process video");
        }
    });
}
exports.processVideoSieve = processVideoSieve;
function fetchSieveData(jobId) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkInterval = 5000;
        const timeout = 60000;
        try {
            let jobData;
            let status = 'processing';
            while (status === 'processing') {
                const response = yield axios_1.default.get(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
                    headers: {
                        'X-API-Key': process.env.SIEVE_API_KEY
                    }
                });
                jobData = response.data;
                status = jobData.status;
                if (status === 'processing') {
                    console.log('Job processing, waiting for completion...');
                    yield new Promise(resolve => setTimeout(resolve, checkInterval));
                }
                else {
                    break;
                }
            }
            console.log('Job completed. Fetching output data...');
            return extractSieveOutputs(jobData.outputs);
        }
        catch (error) {
            console.error('Error fetching');
        }
    });
}
exports.fetchSieveData = fetchSieveData;
function uploadToCloudStorage(fileContent, bucketName, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(fileName);
            const stream = file.createWriteStream({
                metadata: {
                    contentType: 'video/mp4',
                },
            });
            stream.end(fileContent);
            yield new Promise((resolve, reject) => {
                stream.on('finish', resolve);
                stream.on('error', reject);
            });
            const [url] = yield file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60, // expires in 1 hour
            });
            return url;
        }
        catch (error) {
            console.error('Error uploading to Google Cloud Storage:', error);
            throw new Error('Unable to upload file to Cloud Storage');
        }
    });
}
function extractSieveOutputs(outputs) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const text = ((_b = (_a = outputs[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.text) || "";
    const summary = ((_d = (_c = outputs[2]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.summary) || "";
    const title = ((_f = (_e = outputs[3]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.title) || "";
    const tags = ((_h = (_g = outputs[4]) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.tags) || "";
    const chapters = ((_k = (_j = outputs[5]) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.chapters) || "";
    const output = {
        text,
        summary,
        title,
        tags,
        chapters
    };
    return output;
}
