


<div align="center">
  <br />
  <br />
  <img src="yb.png" height="100" width="100">
  <br />
  <br />
  <h3>Transcript.ai</h3>
  <h4>Transcript Youtube links along with AI-generated title, summary, chapters, and tags.</h4>
  <h5>Powered by <a href="https://www.sievedata.com/">Sieve</a>
</div>

## Live Demo with Frontend --inactive
[Youtube Transcript Live App](https://transcript-fe.vercel.app/) 

## Overview
This is the backend service for Youtube Transcript AI. An application to develop detailed
transcripts in over 50 languages, enhanced with AI-created titles, chapter divisions,
concise summaries, and relevant tags. It is built using Node.js with Express and is designed
with a very simplistic model. <br /> <br /> **Simply one endpoint `/submit` that takes in a raw youtube link and interacts with the Sieve Data
API to create the full transcription alongside the specified features in downloadable PDF form.**
<br /> 
<br />

## Setup and Installation

**Prerequisites**

* Node.js installed <br />
* An API key for Sieve Data <br />
* OpenAI API key<br />
* Other environment variables (`.env.example` available)

**Installation**

Clone the repository.
Run `npm install` for dependencies.

**Starting the Server**

Run `npm start` to start the server.

**For Local Development**
In line 10-20 of `sieveService.js` 

Uncomment: 
```
//// TESTING
const storage = new Storage({});
```
Comment: 
```
PROD
const storage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "")
});
```

## API Endpoint
POST `/submit` - Submit a link for transcription and title retrieval. <br />
Body: `{ "link": "URL" }` <br /> 
Output: `{ text, summary, title, tags, chapters }`

## Usage

To interact with the server, send HTTP requests to the respective endpoints with the required data.

## Error Handling

The server provides basic error handling for failed requests or internal errors.

## Next Steps 
1. I want to switch to Python. Sieve, the library used for transcription services, has a native Python SDK but not for Node.js. 
Therefore transcription service is currently implemented with raw curl requests. The biggest downside of this is having to separate 
submitting a job and retreiving that job, while the Python SDK offers a single function `.run()` which abstracts this into one. 

## Contributing

This project is * early stages*, so contributions are very welcome! Please ensure to follow the project's code style and contribution guidelines.

Shoot me an email if you get stuck at any part andere.emi@gmail.com
