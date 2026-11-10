import express from 'express'
import authUser from '../middlewares/auth.middleware.js'
import upload from '../middlewares/middlewaremulter.js'
import {generateInterviewReportfromAI , getInterviewReportById , getAllInterviewReportsByUserId , generateResumePdfController} from '../controllers/interview-controller.js'


const interviewRouter = express.Router()

interviewRouter.post("/" ,authUser , upload.single("resume") , generateInterviewReportfromAI )

interviewRouter.get("/report/:id" , authUser , getInterviewReportById )

interviewRouter.get("/user/:userId" , authUser , getAllInterviewReportsByUserId )

interviewRouter.post("/resume/pdf/:interviewReportId" , authUser ,generateResumePdfController )

export default interviewRouter