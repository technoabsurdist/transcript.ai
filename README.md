


<div align="center">
  <h3>Transcript.ai</h3>
  <h4>Transcript Youtube links along with summary, chapters, and tags</h4>
  <h5>Powered by <a href="https://www.sievedata.com/">Sieve</a>
</div>

## Live Demo
[Youtube Transcript Live App](https://transcript-fe.vercel.app/)

## Overview
This backend server is built using Node.js with Express and is designed to provide various functionalities including transcription and summary generation for audio and video files. It interacts with an external API (Sieve Data) for processing requests.

## Features
* Root Endpoint: A simple GET request to check if the server is running. <br />
* Transcription Service: Transcribes audio from a provided link. <br /> 
* YouTube Video Title Retrieval: Gets the title of a YouTube video from a given link. <br /> 
* Job Status Check: Checks the status of a transcription or summary generation job. <br />
* Summary Generation: Generates a summary from a video file. <br />

## Setup and Installation

Prerequisites

Node.js installed
An API key for Sieve Data
Environment Variables

PORT: The port on which the server will run (default is 3000).
SIEVE_API_KEY: Your API key for Sieve Data.

Installation

Clone the repository.
Run npm install to install dependencies.
Starting the Server

Run npm start to start the server.

## API Endpoints
GET / - Check server status. <br /> <br />  
POST /submit - Submit a link for transcription and title retrieval. <br />
Body: `{ "link": "URL" }` <br /> <br />  
POST /transcribe - Submit a link for audio transcription. <br /> 
Body: `{ "link": "URL" }` <br /> <br />
GET /check-status/:jobId - Check the status of a transcription or summary job. <br /> <br /> 
POST /summary - Submit a link for video summary generation. <br />
Body: `{ "link": "URL" }` <br />

## Usage

To interact with the server, send HTTP requests to the respective endpoints with the required data.

## Error Handling

The server provides basic error handling for failed requests or internal errors.

## Dependencies
express
dotenv
body-parser
cors
axios

## Contributing

Contributions to the project are welcome. Please ensure to follow the project's code style and contribution guidelines.