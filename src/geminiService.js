import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function encodeImageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

export async function askGeminiWithImages(prompt, imagePaths) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  // Prepare the image parts
  const imageParts = imagePaths.map((path) => ({
    inlineData: {
      data: encodeImageToBase64(path),
      mimeType: "image/png" // Change to "image/jpeg" if your images are JPEGs
    }
  }));

  const result = await model.generateContent([
    { text: prompt },
    ...imageParts
  ]);
  const response = await result.response;
  return response.text();
}
