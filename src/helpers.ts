import fs from "fs";
import ytdl from "ytdl-core";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

async function downloadAudio(link: string, outputFileName: string) {
    return new Promise((resolve, reject) => {
        ytdl(link, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(outputFileName))
            .on('finish', resolve)
            .on('error', reject);
    });
}

async function transcribeAudio(file: string) {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(file),
            model: "whisper-1"
        });
        return transcription.text;
    } catch (error) {
        console.error('Error transcribing the file:', error);
        return null;
    }
}

// Main function to handle the download and transcription process
export async function downloadAndTranscribe(link: string) {
    const outputFileName = 'output.mp3';

    try {
        await downloadAudio(link, outputFileName);
        return await transcribeAudio(outputFileName);
    } catch (error) {
        console.error('Error in download and transcription process:', error);
        return null;
    }
}
