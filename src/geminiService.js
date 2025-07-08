import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function encodeImageToBase64(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
} 

function getMimeType(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  throw new Error(`Unsupported image type: ${imagePath}`);
}

export async function askGeminiWithImages(prompt, imagePaths) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Prepare the image parts
  const imageParts = imagePaths.map((imgPath) => ({
    inlineData: {
      data: encodeImageToBase64(imgPath),
      mimeType: getMimeType(imgPath)
    }
  }));

  const result = await model.generateContent([
    { text: prompt },
    ...imageParts
  ]);
  const response = await result.response;
  return response.text();
}
