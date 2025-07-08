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
      // Only run the comparison question for the comparison model
      if (question.id === "image_comparison" && gallery.id !== "jbl-flip6-comparison") {
        continue;
      }
      // Only run single-image questions for single-image models
      if (question.id !== "image_comparison" && gallery.media.length > 1) {
        continue;
      }
      // Use generatePrompt for single-image questions
      let prompt;

      // if the question is not image_comparison, then we need to generate a prompt
      if (question.id !== "image_comparison") {
        prompt = generatePrompt(question.promptTemplate, gallery); // filles in placeholders in the template
      } else {
        prompt = question.promptTemplate; // no placeholders to fill in, just the raw template
      }
      console.log(`\n---\nQuestion: ${question.question}\nPrompt:\n${prompt}\n`);
      const answer = await askGeminiWithImages(prompt, gallery.media);
      console.log(`Gemini Answer: ${answer}\n`);
    }
  }
}

main().catch(console.error);





