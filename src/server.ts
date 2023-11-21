import express from "express"; 
import dotenv from "dotenv";
import cors from "cors"
import axios from "axios"
import { transcribe } from "./transcribe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SIEVE_API_KEY = process.env.SIEVE_API_KEY;

app.use(cors());
app.use(express.json());

// endpoints
app.get("/", async (req, res) => {
  res.send("Ready to run!")
});

app.post("/submit", handleSubmit);

app.post('/transcribe', handleTranscribe);

app.get('/check-status/:jobId', handleCheckStatus);

app.listen(PORT, () => {
  console.log(`[server]: Server is running on ${PORT}`);
});

async function handleSubmit(req: any, res: any): Promise<void> {
  const { link } = req.body;
  try {
    const { text, summary, title, tags, chapters }= await transcribe(link); 
    res.send({ text, summary, title, tags, chapters });
  } catch (error) {
    console.error('Error in processing the request:', error);
    res.status(500).send({ error: 'An error occurred while processing your request. Please try again later.' });
  }
}

async function handleTranscribe(req: any, res: any) {
  const { link } = req.body;
  try {
      const response = await axios.post('https://mango.sievedata.com/v2/push', {
          function: "sieve/speech_transcriber",
          inputs: {
              file: { url: link }
          }
      }, {
          headers: { 'X-API-Key': SIEVE_API_KEY }
      });
      const jobId = response.data.id;
      res.send(jobId);
  } catch (error) {
      res.status(500).send('Error during transcription');
  }
}

async function handleCheckStatus(req: any, res: any) {
  const jobId = req.params.jobId;
  try {
      const response = await axios.get(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
          headers: { 'X-API-Key': SIEVE_API_KEY }
      });
      const jobStatus = response.data.status;

      if (jobStatus === 'finished' && response.data.outputs) {
          const transcripts = response.data.outputs.map((output: { data: any[]; }) => output.data.map(item => item.text));
          res.json({ transcripts });
      } else {
          res.json({ status: jobStatus });
      }
  } catch (error) {
      res.status(500).send('Error retrieving job status');
  }
}

