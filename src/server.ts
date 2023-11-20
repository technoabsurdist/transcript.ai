import express from "express"; 
import dotenv from "dotenv";
import { downloadAndTranscribe } from "./helpers";
import bodyParser from 'body-parser';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
