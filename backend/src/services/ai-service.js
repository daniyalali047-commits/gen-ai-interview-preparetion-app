import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API,
});

const questionSchema = z.object({
  question: z.string().describe("The question that can be asked in the interview"),
  intention: z.string().describe("The intention of the interviewer behind asking this question"),
  answer: z.string().describe("How to answer this question: points to cover and approach"),
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("Match score between resume and job description, 0 to 100"),
  technicalQuestions: z.array(questionSchema).describe("Technical interview questions"),
  behavioralQuestions: z.array(questionSchema).describe("Behavioral interview questions"),
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"]).describe("Severity of the gap"),
    })
  ).describe("Skill gaps between resume and job description"),
  preparationPlan: z.array(
    z.object({
      day: z.number().describe("Day number of the prep plan"),
      focus: z.string().describe("Core focus area for the day"),
      tasks: z.array(z.string()).describe("Actionable tasks for the day"),
    })
  ).describe("Day-by-day preparation plan"),
});

// zod v4 has built-in conversion; zod-to-json-schema only works with zod v3
const jsonSchema =
  typeof z.toJSONSchema === "function"
    ? z.toJSONSchema(interviewReportSchema)
    : zodToJsonSchema(interviewReportSchema);

async function generateinterviewReport({ resume, jobdescription, selfdescription }) {
  const prompt = `Generate a detailed interview report for the candidate.
Return JSON with exactly these top-level fields: matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan.

Resume: ${resume}
Job Description: ${jobdescription}
Self Description: ${selfdescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite", // use a model ID from Google's current model list
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
    },
  });

  console.log("RAW:", response.text);

  const parsed = interviewReportSchema.safeParse(JSON.parse(response.text));
  if (!parsed.success) {
    console.error("Schema mismatch:", parsed.error.issues);
    throw new Error("Model output did not match the expected schema");
  }

  return parsed.data;
}

export default generateinterviewReport;

//in this zod just check the ouput is accoriding to schema or not if now so it will check that if parsed is not succed then will throw error