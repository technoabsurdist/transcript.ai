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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribe = void 0;
const utils_1 = require("./utils");
const sieveService_1 = require("./sieveService");
function transcribe(link) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputFileName = 'output.mp3';
        try {
            yield (0, utils_1.downloadAudio)(link, outputFileName);
            const { jobId } = yield (0, sieveService_1.processVideoSieve)(outputFileName);
            return yield (0, sieveService_1.fetchSieveData)(jobId);
        }
        catch (error) {
            throw new Error(`Transcription error: ${error.message}`);
        }
    });
}
exports.transcribe = transcribe;
