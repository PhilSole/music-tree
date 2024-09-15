import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only enable livereload in development mode
if (process.env.NODE_ENV === 'development') {
    console.log('Development server started');

    const livereload = await import('livereload');
    const connectLivereload = await import('connect-livereload');

    // LiveReload setup
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, '../dist'));

    // Inject the LiveReload script into the HTML served by Express
    app.use(connectLivereload.default());

    // Notify LiveReload server when files change
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
} else {
    console.log('Production server started');
}

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../dist')));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route to handle API call
app.post('/api/chat', async (req, res) => {
    console.log('chat apit request started');

    try {
        const { message } = req.body;

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: 'user', content: message }],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "text"
            },
        });
        
        console.log(response.choices[0].message);

        // Send the response back to the clientsdfdsf
        res.json({
            reply: response.choices[0].message.content,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Add this route for testing
app.post('/api/test', (req, res) => {
    res.json({ message: 'This is a test response from the server' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

