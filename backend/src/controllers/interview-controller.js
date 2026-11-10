import { PDFParse } from "pdf-parse";
import generateinterviewReport from "../services/ai-service.js";
import interviewReportModel from "../models/interviewreport-model.js";

export async function generateInterviewReportfromAI(req, resp) {
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

export async function getInterviewReportById(req, resp) {
  const { id } = req.params;
  const interviewReport = await interviewReportModel.findById(id);

  if (!interviewReport) {
    return resp.status(404).json({ message: "Interview report not found" });
  }

  resp.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

export async function getAllInterviewReportsByUserId(req, resp) {
  const { userId } = req.params;
  const interviewReports = await interviewReportModel.find({ user: userId }).select('-resume -selfdescription -jobdescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan');

  if (!interviewReports || interviewReports.length === 0) {
    return resp.status(404).json({ message: "No interview reports found for this user" });
  }

  resp.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
}

export default {
  generateInterviewReportfromAI,
  getInterviewReportById,
  getAllInterviewReportsByUserId,
};
