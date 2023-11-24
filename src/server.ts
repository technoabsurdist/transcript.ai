import express from "express"; 
import dotenv from "dotenv";
import cors from "cors"
import { transcribe } from "./transcribe";
import { fetchSieveData } from "./sieveService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Transcription.ai Express Server Running!")
});

app.post("/submit", handleSubmit);
async function handleSubmit(req: any, res: any): Promise<any> {
  const { link } = req.body;
  if (!link) { res.status(500).send("Link not provided!"); return; }
  console.log("Received link: ", link);
  console.log("Transcribing...")
  const jobId = await transcribe(link);
  console.log("Transcribed!")

  let status = 'processing';
  let data;

  while (status === 'processing') {
    const response = await fetchSieveData(jobId);
    console.log("Fetching Sieve Model Output...")
    status = response.status;
    data = response.data;
    console.log("Current status: ", response.status)
    if (status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log("Output: ", data);
  res.send(data);
}


app.get("/jobs/:jobId", handleFetchJob);
async function handleFetchJob(req: any, res: any): Promise<void> {
  try {
      const jobId = req.params.jobId; 
      if (!jobId) {
          return res.status(400).json({ error: 'Missing jobId' });
      }

      const jobResult = await fetchSieveData(jobId); 

      if (jobResult.data === "processing") {
        return res.status(503).json({ error: "Processing, outputs not ready yet..."})
      }
      return res.status(200).json(jobResult);
  } catch (error) {
      console.error('Error fetching job:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
}


app.listen(PORT, () => {
  console.log(`[server]: Server is running on ${PORT}`);
});