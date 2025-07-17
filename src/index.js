import { galleryModels } from './galleryModels.js';
import { questions } from './questions.js';
import { askGeminiWithImages } from './geminiService.js';
import { generatePrompt } from './promptEngine.js';

console.log('Gemini Project running...');
console.log('Available models:');
for (let i = 0; i < galleryModels.length; i++){
  console.log(galleryModels[i].title + "\n");
}
console.log('Available questions:');
for (let i = 0; i < questions.length; i++){
  console.log(questions[i].id + "\n");
}

async function main() {
  for (const gallery of galleryModels) {
    for (const question of questions) {
      // Only ask questions that are listed in the gallery's questionIds
      if (!gallery.questionIds.includes(question.id)) continue;
      if (question.requiresTwoImages && gallery.media.length !== 2) continue;
      if (!question.requiresTwoImages && gallery.media.length !== 1) continue;

      let previousResponse = null;
      for (let i = 0; i < question.prompts.length; i++) {
        let prompt = question.prompts[i];

        // fill in placeholders for single-image questions
        if (!question.requiresTwoImages) {
          prompt = generatePrompt(prompt, gallery);
        }

        // for multi-step flows, insert previous response if needed
        if (previousResponse && prompt.includes('{previous_response}')) {
          prompt = prompt.replace('{previous_response}', typeof previousResponse === 'string' ? previousResponse : JSON.stringify(previousResponse));
        }

        console.log(`---\nQuestion:\n${question.question}\nPrompt (Step ${i + 1}):\n${prompt}\n`);
        const answer = await askGeminiWithImages(prompt, gallery.media);
        console.log('Gemini Answer:', answer, '\n');
        previousResponse = answer;
      }
    }
  }
}

main().catch(console.error);





