// api.js
import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { askGeminiWithImages } from './src/geminiService.js';
import { questions as allQuestions } from './src/questions.js';
import { generatePrompt } from './src/promptEngine.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

// Download an image from a URL and save it to a file
async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not download image');
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

// Main API endpoint
app.post('/api/ask-gemini', async (req, res) => {
  try {
    const { images, questions, description } = req.body;
    if (!images || !questions) return res.status(400).json({ error: 'Missing images or questions' });

    // Download images to local files
    const tempDir = './tmp';
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const localPaths = [];
    for (let i = 0; i < images.length; i++) {
      const url = images[i];
      const ext = path.extname(url).split('?')[0] || '.jpg';
      const dest = `${tempDir}/img_${Date.now()}_${i}${ext}`;
      await downloadImage(url, dest);
      localPaths.push(dest);
    }

    // For each question, get the answer from Gemini
    const result = {};
    for (const qid of questions) {
      const q = allQuestions.find(q => q.id === qid);
      if (!q) continue;
      let previousResponse = null;
      for (let i = 0; i < q.prompts.length; i++) {
        let prompt = q.prompts[i];
        if (!q.requiresTwoImages) {
          prompt = generatePrompt(prompt, { media: [localPaths[0]], metadata: { description: description || '' } });
        }
        if (previousResponse && prompt.includes('{previous_response}')) {
          prompt = prompt.replace('{previous_response}', previousResponse);
        }
        previousResponse = await askGeminiWithImages(prompt, localPaths);
      }
      result[qid] = previousResponse;
    }

    // Delete the downloaded images
    for (const p of localPaths) fs.unlinkSync(p);

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Serve the frontend files
app.use(express.static('./public'));

app.listen(3005, () => {
  console.log('API running on http://localhost:3005');
});
