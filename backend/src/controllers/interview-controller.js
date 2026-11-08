import { PDFParse } from "pdf-parse";
import generateinterviewReport from "../services/ai-service.js";
import interviewReportModel from "../models/interviewreport-model.js";

async function generateInterviewReportfromAI(req, resp) {
  if (!req.file || !req.file.buffer) {
    return resp.status(400).json({ message: "Resume PDF is required" });
  }

  const parser = new PDFParse({ data: req.file.buffer });
  const pdfResult = await parser.getText();
  const resumeText = pdfResult.text;
  const { selfdescription, jobdescription } = req.body;

  const interviewReportByAi = await generateinterviewReport({
    resume: resumeText,
    selfdescription,
    jobdescription,
  });

  const interviewReportCreate = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfdescription,
    jobdescription,
    ...interviewReportByAi,
  });

  resp.status(201).json({
    message: "Interview report generate successfully",
    interviewReportCreate,
  });
}

export default generateInterviewReportfromAI;