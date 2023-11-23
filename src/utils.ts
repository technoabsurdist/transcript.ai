import fs from 'fs';
import ytdl from 'ytdl-core';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function downloadAudio(link: string, outputFileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ytdl(link, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(outputFileName))
            .on('finish', resolve)
            .on('error', (error) => reject(new Error(`Download error: ${error.message}`)));
    });
}
