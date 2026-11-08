import express from 'express'
import authUser from '../middlewares/auth.middleware.js'
import upload from '../middlewares/middlewaremulter.js'
import generateInterviewReportfromAI from '../controllers/interview-controller.js'


const interviewRouter = express.Router()

interviewRouter.post("/" ,authUser , upload.single("resume") , generateInterviewReportfromAI )

export default interviewRouter