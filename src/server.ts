import express from "express"; 
import dotenv from "dotenv";
import { transcribe, getYoutubeVideoTitle } from "./helpers";
import bodyParser from 'body-parser';
import {config} from "./config";
import cors from "cors"
import axios from "axios"

dotenv.config();
const PORT = process.env.PORT || 3000;
const SIEVE_API_KEY = process.env.SIEVE_API_KEY
const app = express();

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


app.get("/", async (req, res) => {
  res.send("Ready to run!")
})
app.post("/submit", async (req, res) => {
  const { link } = req.body;
  try {
    const text = await transcribe(link); 
    const title = await getYoutubeVideoTitle(link)
    res.send({ "text": text, "title": title });
  } catch (error) {
    console.error('Error in processing the request:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/transcribe', async (req, res) => {
  const { link } = req.body
  try {
      const response = await axios.post('https://mango.sievedata.com/v2/push', {
          function: "sieve/speech_transcriber",
          inputs: {
              file: {
                  url: link
              }
          }
      }, {
          headers: {
              'X-API-Key': SIEVE_API_KEY
          }
      });
      const jobId = response.data.id;
      res.send(jobId);
  } catch (error) {
      res.status(500).send('Error during transcription');
  }
});

app.get('/check-status/:jobId', async (req, res) => {
  try {
      const jobId = req.params.jobId;
      const response = await axios.get(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
          headers: {
              'X-API-Key': SIEVE_API_KEY 
          }
      });

      if (response.data.status === 'finished' && response.data.outputs) {
          const transcripts = response.data.outputs.map((output: { data: any[]; }) => output.data.map(item => item.text));
          res.json({ transcripts });
      } else {
          res.json({ status: response.data.status });
      }
  } catch (error) {
      res.status(500).send('Error retrieving job status');
  }
});

app.post('/summary', async (req, res) => {
  const { link } = req.body
  try {
      const apiKey = SIEVE_API_KEY; 
      const response = await axios.post('https://mango.sievedata.com/v2/push', {
          function: "sieve/video_transcript_analyzer",
          inputs: {
              file: { url: link },
              generate_chapters: true,
              max_summary_length: 5,
              max_title_length: 10,
              num_tags: 5
          }
      }, {
          headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey
          }
      });

      res.json(response.data);
  } catch (error) {
      res.status(500).send('Error during summary generation');
  }
});

app.listen(config.server.port, () => {
  return console.log(`[server]: Server is running on ${config.server.port}`);
});
