import { downloadAudio } from './utils';
import { fetchSieveData, processVideoSieve } from './sieveService';

export async function transcribe(link: string) {
    const outputFileName = 'output.mp3';

    try {
        console.log("Downloading audio..."); 
        await downloadAudio(link, outputFileName);
        const { jobId } = await processVideoSieve(outputFileName);
        console.log("Submitted Job with ID: ", jobId); 
        return jobId; 


    } catch (error: any) {
        throw new Error(`Transcription error: ${error.message}`);
    }
}