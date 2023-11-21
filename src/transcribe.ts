import { downloadAudio } from './utils';
import { fetchSieveData, processVideoSieve } from './sieveService';
import { TranscribeOutput } from './interfaces';

export async function transcribe(link: string): Promise<TranscribeOutput> {
    const outputFileName = 'output.mp3';

    try {
        await downloadAudio(link, outputFileName);
        const { jobId } = await processVideoSieve(outputFileName);
        return await fetchSieveData(jobId); 
    } catch (error: any) {
        throw new Error(`Transcription error: ${error.message}`);
    }
}
