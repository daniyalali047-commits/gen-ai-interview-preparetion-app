import {generateInterviewReport , getInterviewReportById , getAllinterviewReportsByUserId} from "../services/api.js"
import { useCallback, useContext } from 'react'
import { interviewcontext } from '../interview.context.jsx'

export const useInterviewhook = ()=>{

    const context = useContext(interviewcontext)
    if(!context){
        throw new Error("useInterviewhook must be used within a interviewProvider")
    }
    const {loading , setloading , report , setreport , reports , setreports} = context
const generatereport = async ({jobdescription , selfdescription , resumeFile})=>{
    setloading(true)
    try {
        const resp = await generateInterviewReport({jobdescription , selfdescription , resumeFile})
        const generatedReport = resp.interviewReport ?? resp.interviewReportCreate
        if (!generatedReport) {
            throw new Error('The server response did not include the generated report.')
        }
        setreport(generatedReport)
        return generatedReport
    } catch (error) {
        console.error('Failed to generate interview report:', error)
        throw error
    }finally{
        setloading(false)
    }
}

const getreportbyid = useCallback(async (interviewId)=>{
    setloading(true)
    try {
        const resp= await getInterviewReportById(interviewId)
        setreport(resp.interviewReport)
        return resp.interviewReport
    } catch (error) {
        console.error('Failed to fetch interview report:', error)
        throw error
    }finally{
        setloading(false)
    }
}, [setloading, setreport])

const getreports = async ()=>{
    setloading(true)
    try {
         const resp = await getAllinterviewReportsByUserId()
  setreports(resp.interviewReports)

    } catch (error) {
        console.log(error)
    }finally{
        setloading(false)
    }
   
}
return {loading , setloading , report , generatereport , getreportbyid , getreports}
}