import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API
});

async function envoke(){
    const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: "can you tell who is bilgates"
})

    console.log(response.text);
    
}

export default envoke