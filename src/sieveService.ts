import axios from 'axios';
import fs from 'fs';
import { ProcessOutput } from './interfaces';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv"

dotenv.config()

const storage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "")
});

export async function processVideoSieve(file: string): Promise<ProcessOutput> {
    try {
        const fileContent = fs.readFileSync(file);

        const bucketName = 'sieve-transcription';
        const fileName = `output-${uuidv4()}.mp4`;
        console.log(">>> Uploading file to google cloud storage...")
        const fileUrl = await uploadToCloudStorage(fileContent, bucketName, fileName)

        const response = await axios.post('https://mango.sievedata.com/v2/push', {
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

        return { jobId: response.data.id }

    } catch (error) {
        console.log(error)
        throw new Error("Unable to process video")
    }
}

export async function fetchSieveData(jobId: string): Promise<any> {
    const checkInterval = 5000; // 5 seconds
    const timeout = 60000; // 60 seconds for timeout

    try {
        let jobData;
        let status = 'processing';

        while (status === 'processing') {
            const response = await axios.get(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
                headers: {
                    'X-API-Key': process.env.SIEVE_API_KEY
                }
            });

            jobData = response.data;
            status = jobData.status;

            if (status === 'processing') {
                console.log('Job processing, waiting for completion...');
                await new Promise(resolve => setTimeout(resolve, checkInterval));
            } else {
                break; 
            }
        }

        console.log('Job completed. Fetching output data...');
        return extractSieveOutputs(jobData.outputs);

    } catch (error) {
        console.error('Error fetching')
    }
}


async function uploadToCloudStorage(fileContent: any, bucketName: any, fileName: any) {
    try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'video/mp4',
            },
        });

        stream.end(fileContent);

        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // expires in 1 hour
        });

        return url;

    } catch (error) {
        console.error('Error uploading to Google Cloud Storage:', error);
        throw new Error('Unable to upload file to Cloud Storage');
    }
}

function extractSieveOutputs(outputs: any) {
    const text = outputs[0]?.data?.text || "";
    const summary = outputs[2]?.data?.summary || "";
    const title = outputs[3]?.data?.title || "";
    const tags = outputs[4]?.data?.tags || "";
    const chapters = outputs[5]?.data?.chapters || "";

    const output = {
        text,
        summary,
        title,
        tags,
        chapters 
    }

    return output
}