import express from "express" 
import dotenv from "dotenv"
import { downloadYoutubeLink, getTranscript } from "./helpers"

dotenv.config()
const app = express()
const port = 3000

app.use(express.json())
app.use(function(_req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.options('*', (_req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).send('');
});

app.get("/",async (_req, res) => {
  console.log("Hello server!") 
})

app.get("/testing", async (_req, res) => {
  console.log("Testing server")  
})

app.post("/submit/:link", async (req, res) => {
  const link = req.params.link
  const file = downloadYoutubeLink(link)
  const transcript = getTranscript(file)
  return res.send(transcript)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});