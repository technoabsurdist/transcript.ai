import express from "express"; 
import dotenv from "dotenv";
import { downloadAndTranscribe } from "./helpers";
import bodyParser from 'body-parser';
import {config} from "./config";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.json());


app.get("/", async (req, res) => {
  res.send("Ready to run!")
})
app.post("/submit", async (req, res) => {
  const { link } = req.body;
  try {
    const text = await downloadAndTranscribe(link); 
    res.send({ "text": text });
  } catch (error) {
    console.error('Error in processing the request:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(config.server.port, () => {
  return console.log(`[server]: Server is running on ${config.server.port}`);
});
