import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { gemini_api_call } from './scripts_/gemini_api_call.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.post('/gemini', async (req, res) => {
  try {
    const { userQuery } = req.body || {};
    if (!userQuery || !userQuery.trim()) {
      return res.status(400).json({ error: 'No query provided' });
    }

    const data = await gemini_api_call(userQuery); 
    
    return res.status(data.error ? 502 : 200).json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ error: error.message || 'Error processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
