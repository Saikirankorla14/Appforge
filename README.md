# AppForge ⚡

An AI-powered web app generator using Groq + LLaMA 3.3 70B.
<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/900ceaa0-7e3f-4668-957f-827d66d6e83b" />


## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure your Groq API key**

   Edit the `.env` file and replace the placeholder:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   Get a free key at https://console.groq.com

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## How it works

- The frontend sends your app description to the local Express server
- The server reads the `GROQ_API_KEY` from `.env` and calls the Groq API
- Groq runs LLaMA 3.3 70B to generate a complete single-file HTML app
- The result is previewed instantly in an iframe

## Project structure

```
appforge/
├── public/
│   └── index.html      # Frontend UI
├── server.js           # Express server + Groq proxy
├── .env                # Your API key (never commit this)
├── .env.example        # Safe template to share
├── .gitignore
└── package.json
```
