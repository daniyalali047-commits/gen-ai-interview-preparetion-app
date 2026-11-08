import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API,
});

const interviewReportSchema = z.object({

    //match score
    matchScore: z.number().describe("The match score between the candidate's resume and the job description, ranging from 0 to 100"),

    // Technical question Zod schema
 technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach")
    })
  ).describe("Technical questions that can be asked in the interview along with their intention and answer approach"),

// Behavioral question Zod schema
behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The behavioral question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach")
    })
  ).describe("Behavioral questions that can be asked in the interview along with their intention"),

// Skill gaps Zod schema
skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill which the candidate is lacking"),
      severity: z.enum(['low', 'medium', 'high']).describe("Severity level of the skill gap")
    })
  ).describe("Skill gaps identified between resume and job description"),

// Preparation plan Zod schema
preparationPlan: z.array(
    z.object({
      day: z.number().describe("Day number of the prep plan"),
      focus: z.string().describe("Core focus area for the day"),
      tasks: z.array(z.string()).describe("List of actionable tasks to complete")
    })
  ).describe("Day-by-day preparation plan for the candidate")
});

async function generateinterviewReport({resume , jobdescription , selfdescription}) {
  const prompt = `Generate a detailed interview report for the candidate based on the following information:
Resume: ${resume}
Job Description: ${jobdescription}
Self Description: ${selfdescription}`

  const response = await ai.models.generateContent({
    model:"gemini-3.5-flash",
    contents:prompt,
    config:{
        responseMimeType:"application/json",
        responseSchema:zodToJsonSchema(interviewReportSchema)
    }
  })
  console.log(response.text)
}

export default generateinterviewReport


//3:39