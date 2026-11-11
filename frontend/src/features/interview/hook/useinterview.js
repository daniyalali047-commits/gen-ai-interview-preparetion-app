import {generateInterviewReport , getInterviewReportById , getAllinterviewReportsByUserId , generateresumepdf} from "../services/api.js"
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

const getreports = useCallback(async (userId)=>{
    try {
        const resp = await getAllinterviewReportsByUserId(userId)
        setreports(Array.isArray(resp.interviewReports) ? resp.interviewReports : [])
    } catch (error) {
        if (error.response?.status === 404) {
            setreports([])
            return
        }

        console.error('Failed to fetch interview reports:', error)
        throw error
    }
}, [setreports])

const resumepdf = useCallback(async (interviewReportId)=>{
    if (!interviewReportId) {
        throw new Error('Interview report ID is required to generate the resume PDF.')
    }

    setloading(true)

    try {
        const pdfBlob = await generateresumepdf({ interviewReportId })

        if (typeof Blob !== 'undefined' && !(pdfBlob instanceof Blob)) {
            throw new Error('The PDF response was not returned as a valid file.')
        }

        if (typeof window !== 'undefined') {
            const pdfUrl = window.URL.createObjectURL(pdfBlob)
            const link = document.createElement('a')
            link.href = pdfUrl
            link.download = `resume_${interviewReportId}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(pdfUrl)
        }

        return true
    } catch (error) {
        console.error('Failed to generate resume PDF:', error)
        throw error
    } finally {
        setloading(false)
    }
}, [setloading])

return {loading , setloading , report , generatereport , getreportbyid , getreports, reports, resumepdf}
}