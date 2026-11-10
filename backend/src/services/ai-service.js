import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import PDFDocument from "pdfkit";
import { PassThrough } from "node:stream";

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
  title: z.string().describe("Title of the job for which interview report is generated"),
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

  // console.log("RAW:", response.text);
  return JSON.parse(response.text)

  const parsed = interviewReportSchema.safeParse(JSON.parse(response.text));
  if (!parsed.success) {
    console.error("Schema mismatch:", parsed.error.issues);
    throw new Error("Model output did not match the expected schema");
  }

  return parsed.data;
}


async function createResumePdf(resumeText) {
  const document = new PDFDocument({ size: "A4" });
  const output = new PassThrough();
  const chunks = [];

  document.pipe(output);
  output.on("data", (chunk) => chunks.push(chunk));

  const pdfReady = new Promise((resolve, reject) => {
    output.on("end", resolve);
    output.on("error", reject);
    document.on("error", reject);
  });

  document
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#1f2937")
    .text("Resume", { align: "center" });
  document.moveDown(1.5);
  document
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#111827")
    .text(resumeText, { lineGap: 4 });
  document.end();

  await pdfReady;
  return Buffer.concat(chunks);
}

async function generateresumepdf({ resume, selfdescription, jobdescription }) {
  const resumeSchema = z.object({
    resumeText: z.string().describe("A complete resume as plain text with clear section headings and bullet points"),
  });
  const resumeJsonSchema =
    typeof z.toJSONSchema === "function"
      ? z.toJSONSchema(resumeSchema)
      : zodToJsonSchema(resumeSchema);

  const prompt = `Create a polished, tailored resume for the candidate using the following information.
Return JSON with one field, resumeText. The value must be plain text, not HTML or Markdown.
Use clear section headings with bold and put each experience, skill, and achievement on its own line.
Make the layout professional  and it should not be look like it is written by an AI
 Resume:${resume}
 Self Description:${selfdescription}
 Job Description:${jobdescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: resumeJsonSchema,
    },
  });
  const parsed = resumeSchema.safeParse(JSON.parse(response.text));
  if (!parsed.success) {
    console.error("Resume output did not match the expected schema:", parsed.error.issues);
    throw new Error("The generated resume did not match the expected format.");
  }

  return createResumePdf(parsed.data.resumeText);
}
export { generateinterviewReport ,generateresumepdf};

//in this zod just check the ouput is accoriding to schema or not if now so it will check that if parsed is not succed then will throw error