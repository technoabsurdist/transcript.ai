import express from "express" 
import dotenv from "dotenv"
import { downloadYoutubeLink, getTranscript } from "./helpers"

dotenv.config()
const OPENAI_API_KEY=process.env.OPENAI_API_KEY
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
// app.use(function(_req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//   next();
// });
// app.options('*', (_req, res) => {
//   res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');
//   res.status(204).send('');
// });

app.get("/",async (_req, res) => {
  res.send("Hello from testing!")
})

app.post("/submit/:link", async (req, res) => {
  const link = req.params.link
  const file = downloadYoutubeLink(link)
  const transcript = getTranscript(file)
  return res.send(transcript)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});