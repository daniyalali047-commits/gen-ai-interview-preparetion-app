import express from 'express'
import authUser from '../middlewares/auth.middleware.js'
import upload from '../middlewares/middlewaremulter.js'
import {generateInterviewReportfromAI , getInterviewReportById , getAllInterviewReportsByUserId} from '../controllers/interview-controller.js'


const interviewRouter = express.Router()

interviewRouter.post("/" ,authUser , upload.single("resume") , generateInterviewReportfromAI )

interviewRouter.get("/report/:id" , authUser , getInterviewReportById )

interviewRouter.get("/user/:userId" , authUser , getAllInterviewReportsByUserId )

export default interviewRouter