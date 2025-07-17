export const galleryModels = [
  {
    id: "jbl-flip6",
    title: "JBL Flip 6",
    media: ["Images/jbl-flip6.png"],
    metadata: {
      description: "Blue JBL Flip 6 portable speaker",
      color: "Blue"
    },
    questionIds: ["color_accuracy", "product_match"]
  },
  {
    id: "jbl-flip6-comparison",
    title: "JBL Speaker Comparison",
    media: [
      "Images/jbl-flip6.png",      // first image (e.g., golden sample)
      "Images/jbl-flip6_ALT.png"   // second image (e.g., product to check)
    ],
    metadata: {
      description: "Compare two images of the JBL Flip 6 portable speaker.",
      color: "Blue"
    },
    questionIds: ["image_comparison", "image_defect_comparison"]
  },
  // can add more if i want
];
