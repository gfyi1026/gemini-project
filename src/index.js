import { galleryModels } from './galleryModels.js';
import { questions } from './questions.js';
import { askGeminiWithImages } from './geminiService.js';
import { generatePrompt } from './promptEngine.js';

console.log('Gemini Project running...');
console.log('Available models:', galleryModels);
console.log('Available questions:', questions);

async function main() {
  for (const gallery of galleryModels) {
    for (const question of questions) {
      // only run comparison questions for galleries with 2 images
      if (question.requiresTwoImages && gallery.media.length !== 2) {
        continue;
      }
      // only run single-image questions for galleries with 1 image
      if (!question.requiresTwoImages && gallery.media.length !== 1) {
        continue;
      }
      // for single-image questions, fill in the prompt with the image and description
      let prompt;
      if (question.requiresTwoImages) {
        prompt = question.promptTemplate; // no placeholders to fill in
      } else {
        prompt = generatePrompt(question.promptTemplate, gallery); // fill in placeholders
      }
      console.log(`---\nQuestion:\n${question.question}\n\nPrompt:\n${prompt}\n`);
      const answer = await askGeminiWithImages(prompt, gallery.media);
      console.log(`Gemini Answer: ${answer}\n`);
    }
  }
}

main().catch(console.error);





