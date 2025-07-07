import { galleryModels } from './galleryModels.js';
import { questions } from './questions.js';
import { generatePrompt } from './promptEngine.js';
import { askGemini } from './geminiService.js';

console.log('Gemini Project running...');
console.log('Available models:', galleryModels);
console.log('Available questions:', questions);

async function main() {
  for (const gallery of galleryModels) {
    for (const question of questions) {
      const prompt = generatePrompt(question.promptTemplate, gallery);
      console.log(`\n---\nQuestion: ${question.question}\nPrompt:\n${prompt}\n`);
      const answer = await askGemini(prompt);
      console.log(`Gemini Answer: ${answer}\n`);
    }
  }
}

main().catch(console.error);





