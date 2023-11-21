import { downloadAudio } from './utils';
import { fetchSieveData, processVideoSieve } from './sieveService';
import { TranscribeOutput } from './interfaces';

export async function transcribe(link: string): Promise<TranscribeOutput> {
    const outputFileName = 'output.mp3';

    try {
        await downloadAudio(link, outputFileName);
        const { jobId } = await processVideoSieve(outputFileName);
        const processOutput = await fetchSieveData(jobId); 
        return processOutput;
    } catch (error: any) {
        throw new Error(`Transcription error: ${error.message}`);
    }
}
