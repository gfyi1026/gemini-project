export const questions = [
  {
    id: "color_accuracy",
    question: "Is the product color accurate?",
    promptTemplate: `You are an expert in product quality control. Given the following product image: {mediaUrl}, and the official product description: {description}, does the color in the image match the description? Answer 'Yes' or 'No' and explain.`
  },
  {
    id: "product_match",
    question: "Is this the correct product model?",
    promptTemplate: `Given the image: {mediaUrl} and the description: {description}, does the image show the correct product model? Answer 'Yes' or 'No' and explain.`
  },
  {
    id: "image_comparison",
    question: "Do these two images show the same product and color?",
    promptTemplate: `You are an expert in product quality control. Given the following two product images, do they show the same product and color? Answer 'Yes' or 'No' and explain.`
  },
  {
    id: "image_defect_comparison",
    question: "Are both products in perfect condition without any visible defects?",
    promptTemplate: `You are an expert in product quality control. Carefully examine the following two product images. Do both products appear to be in perfect condition, free from any visible defects such as scratches, dents, discoloration, or other imperfections? Answer 'Yes' or 'No' and provide a brief explanation of your assessment.`
  }
  // Add more questions as needed
];
