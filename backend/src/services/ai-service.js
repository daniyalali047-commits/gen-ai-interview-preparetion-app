import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import PDFDocument from "pdfkit";
import { PassThrough } from "node:stream";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API,
});

// Fallback list: tries the fastest model first, then switches to backup models if overloaded
const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
];

async function generateWithFallbackAndRetry(prompt, schema) {
  let lastError;

  for (const modelName of FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: schema,
          },
        });
      } catch (error) {
        lastError = error;
        const isOverloaded = error.status === 503 || error.status === 429;

        if (!isOverloaded) {
          throw error; // Throw immediately if it's an API key or schema error
        }

        console.warn(`[${modelName}] Busy (Status ${error.status}), attempt ${attempt}/2...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    console.warn(`Switching away from ${modelName} to next backup model...`);
  }

  throw lastError;
}

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

const jsonSchema =
  typeof z.toJSONSchema === "function"
    ? z.toJSONSchema(interviewReportSchema)
    : zodToJsonSchema(interviewReportSchema);

async function generateinterviewReport({ resume, jobdescription, selfdescription }) {
  const prompt = `Generate a detailed interview report for the candidate.
Return JSON with exactly these top-level fields: matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, title.

Resume: ${resume}
Job Description: ${jobdescription}
Self Description: ${selfdescription}`;

  const response = await generateWithFallbackAndRetry(prompt, jsonSchema);

  const parsed = interviewReportSchema.safeParse(JSON.parse(response.text));
  if (!parsed.success) {
    console.error("Schema mismatch:", parsed.error.issues);
    throw new Error("Model output did not match the expected schema");
  }

  return parsed.data;
}

async function createResumePdf(resumeData) {
  const document = new PDFDocument({
    size: "A4",
    margin: { top: "12mm", bottom: "12mm", left: "14mm", right: "14mm" }, // Tighter page margins
    font: "Helvetica",
  });
  const output = new PassThrough();
  const chunks = [];

  document.pipe(output);
  output.on("data", (chunk) => chunks.push(chunk));

  const pdfReady = new Promise((resolve, reject) => {
    output.on("end", resolve);
    output.on("error", reject);
    document.on("error", reject);
  });

  const pageWidth = document.page.width - document.page.margins.left - document.page.margins.right;

  // 1. Candidate Name & Contact Header
  document
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#111827")
    .text(resumeData.fullName);

  document
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#4b5563")
    .text(resumeData.contactInfo);

  document.moveDown(0.5);

  // 2. Professional Summary
  document
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .fillColor("#111827")
    .text("SUMMARY");
  document
    .moveTo(document.x, document.y + 1)
    .lineTo(document.x + pageWidth, document.y + 1)
    .strokeColor("#d1d5db")
    .stroke();
  document.moveDown(0.3);

  document
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#1f2937")
    .text(resumeData.summary, { lineGap: 2 });
  document.moveDown(0.5);

  // 3. Technical Skills
  document
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .fillColor("#111827")
    .text("TECHNICAL SKILLS");
  document
    .moveTo(document.x, document.y + 1)
    .lineTo(document.x + pageWidth, document.y + 1)
    .strokeColor("#d1d5db")
    .stroke();
  document.moveDown(0.3);

  for (const skillGroup of resumeData.skills) {
    document
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .fillColor("#111827")
      .text(`${skillGroup.category}: `, { continued: true })
      .font("Helvetica")
      .fillColor("#1f2937")
      .text(skillGroup.items, { lineGap: 1.5 });
  }
  document.moveDown(0.5);

  // 4. Experience, Projects, Education & Certifications
  for (const section of resumeData.sections) {
    // Prevent orphaned section headers at the very bottom of a page
    if (document.y > document.page.height - 90) {
      document.addPage();
    }

    document
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .fillColor("#111827")
      .text(section.heading.toUpperCase());
    document
      .moveTo(document.x, document.y + 1)
      .lineTo(document.x + pageWidth, document.y + 1)
      .strokeColor("#d1d5db")
      .stroke();
    document.moveDown(0.3);

    for (const entry of section.entries) {
      const startY = document.y;

      if (entry.date) {
        document
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#6b7280")
          .text(entry.date, document.page.margins.left, startY, {
            align: "right",
            width: pageWidth,
            lineBreak: false,
          });
      }

      document
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#111827")
        .text(entry.title, document.page.margins.left, startY, {
          width: pageWidth - 110,
        });

      document.moveDown(0.15);

      for (const bullet of entry.bullets) {
        document
          .font("Helvetica")
          .fontSize(9.5)
          .fillColor("#1f2937")
          .text(`•  ${bullet}`, { indent: 10, lineGap: 2 });
      }
      document.moveDown(0.35);
    }
    document.moveDown(0.2);
  }

  document.end();
  await pdfReady;
  return Buffer.concat(chunks);
}


async function generateresumepdf({ resume, selfdescription, jobdescription }) {
  const resumeSchema = z.object({
    fullName: z.string().describe("Candidate's full name"),
    contactInfo: z.string().describe("Location, email, phone, GitHub, LinkedIn separated by |"),
    summary: z.string().describe("3-4 line tailored professional summary"),
    skills: z.array(
      z.object({
        category: z.string().describe("Skill category like Languages, Frontend, Backend, Databases, DevOps"),
        items: z.string().describe("Comma-separated list of skills"),
      })
    ),
    sections: z.array(
      z.object({
        heading: z.string().describe("Section name like PROFESSIONAL EXPERIENCE, PROJECTS, EDUCATION"),
        entries: z.array(
          z.object({
            title: z.string().describe("Role and Company, Project Name + Tech Stack, or Degree + University"),
            date: z.string().describe("Date range like Jan 2023 - Present (empty string if none)"),
            bullets: z.array(z.string()).describe("Impactful bullet points without leading bullet characters"),
          })
        ),
      })
    ),
  });

  const resumeJsonSchema =
    typeof z.toJSONSchema === "function"
      ? z.toJSONSchema(resumeSchema)
      : zodToJsonSchema(resumeSchema);

  const prompt = `Create a polished, tailored resume for the candidate using the following information.
Tailor the summary, skills, and bullet points to highlight alignment with the job description while staying truthful to the resume.
Do not include leading bullet symbols (like • or -) inside the bullets array strings.
Resume: ${resume}
Self Description: ${selfdescription}
Job Description: ${jobdescription}`;

  const response = await generateWithFallbackAndRetry(prompt, resumeJsonSchema);

  const parsed = resumeSchema.safeParse(JSON.parse(response.text));
  if (!parsed.success) {
    console.error("Resume output did not match the expected schema:", parsed.error.issues);
    throw new Error("The generated resume did not match the expected format.");
  }

  return createResumePdf(parsed.data);
}


export { generateinterviewReport, generateresumepdf };
