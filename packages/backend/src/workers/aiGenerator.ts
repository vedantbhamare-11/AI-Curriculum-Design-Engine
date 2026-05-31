import { GoogleGenAI, Type, Schema } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Google Gen AI SDK with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the explicit JSON response schema requirement for Gemini
const assessmentResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    aiIntroGreeting: {
      type: Type.STRING,
      description:
        "A friendly, polite conversational greeting introducing the question paper. e.g., 'Certainly! Here is your customized Question Paper...'",
    },
    sections: {
      type: Type.ARRAY,
      description:
        "An array containing separate exam sections grouped by question format configurations.",
      items: {
        type: Type.OBJECT,
        properties: {
          sectionLetter: {
            type: Type.STRING,
            description: "e.g., 'A', 'B', 'C'",
          },
          sectionType: {
            type: Type.STRING,
            description:
              "e.g., 'Multiple Choice Questions', 'Short Questions'",
          },
          instruction: {
            type: Type.STRING,
            description:
              "Instructions for this section, e.g., 'Attempt all questions. Each question carries 2 marks.'",
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: "The core question statement.",
                },
                difficulty: {
                  type: Type.STRING,
                  enum: ["Easy", "Moderate", "Challenging"],
                },
                marks: { type: Type.INTEGER },
                options: {
                  type: Type.ARRAY,
                  description:
                    "CRITICAL: If the section type is 'Multiple Choice Questions', you MUST provide exactly 4 distinct choices here. For other question formats, leave this array completely empty.",
                  items: { type: Type.STRING },
                },
              },
              required: ["text", "difficulty", "marks"],
            },
          },
        },
        required: ["sectionLetter", "sectionType", "instruction", "questions"],
      },
    },
    answerKey: {
      type: Type.ARRAY,
      description:
        "A comprehensive answer grid mapping complete solutions corresponding to every section question sequentially.",
      items: {
        type: Type.OBJECT,
        properties: {
          questionNumber: { type: Type.INTEGER },
          answerText: {
            type: Type.STRING,
            description:
              "Detailed structural step-by-step resolution or marking criteria scheme.",
          },
        },
        required: ["questionNumber", "answerText"],
      },
    },
  },
  required: ["aiIntroGreeting", "sections", "answerKey"],
};

interface IJobInput {
  subject: string;
  className: string;
  additionalInstructions?: string;
  questionConfigs: { type: string; count: number; marksPerQuestion: number }[];
  fileBuffer?: string;      // 💡 Updated to string: Accepts the Base64 data securely passed through BullMQ/Redis
  fileMimeType?: string;    // 💡 e.g., 'application/pdf'
}

export const generatePaperWithGemini = async (data: IJobInput) => {
  const configurationSummary = data.questionConfigs
    .map((c, idx) => `Section ${String.fromCharCode(65 + idx)}: Create ${c.count} ${c.type} allocating ${c.marksPerQuestion} mark(s) each.`)
    .join('\n');

  // Explicit contents array structure to pass to Gemini
  const contentsArray: any[] = [];

  // 💡 CRITICAL FIX: If base64 file data exists, inject it directly as an inlineData object block
  if (data.fileBuffer && data.fileMimeType) {
    console.log("📎 Found Base64 context grounding material. Injecting directly into Gemini context stream...");
    contentsArray.push({
      inlineData: {
        data: data.fileBuffer,
        mimeType: data.fileMimeType
      }
    });
  }

  const systemInstruction = `
    You are an expert academic test designer. Your job is to generate comprehensive exam assessment papers based strictly on provided curriculum constraints.
    
    CRITICAL GROUNDING RULE:
    If an inline document (PDF/Text context/Notes) is present in the parameters contents block, you MUST pull all historical occurrences, specific historical figures, context definitions, vocabulary phrases, and conceptual details exclusively from that document. 
    
    For instance, if the file is a History textbook belonging to a regional board like the Maharashtra State Board, restrict your questioning scope entirely to the concrete chapters, forts, leaders (such as Shivaji Maharaj, Shahaji Raje, Jijabai), and milestones listed in that precise book. Do not invent external, generalized world history concepts outside the boundary framework of the provided document.
    
    CRITICAL FORMAT RULES:
    1. Distribute question difficulties naturally across [Easy, Moderate, Challenging].
    2. You MUST adhere precisely to the exact question type counts and marks provided.
  `;

  const userPrompt = `
    Create an academic exam paper using these parameters:
    - Subject Field: ${data.subject}
    - Student Grade/Class Target: ${data.className}
    - Blueprint Configuration Specifications:
    ${configurationSummary}
    
    - Additional Instructions: ${data.additionalInstructions || "None provided."}
    
    Please analyze the attached material context carefully to construct matching educational evaluations.
  `;

  // 💡 Wrap prompt string cleanly into a text part structure array matching modern SDK specifications
  contentsArray.push({ text: userPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contentsArray,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: assessmentResponseSchema,
      temperature: 0.1, // Locked lower to maximize source integrity adherence and limit hallucinations
    },
  });

  if (!response.text) {
    throw new Error("Gemini engine failed to generate an output block structure.");
  }

  return JSON.parse(response.text);
};