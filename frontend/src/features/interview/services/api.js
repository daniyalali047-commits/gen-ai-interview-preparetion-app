import axios from 'axios';

const api = axios.create({
  baseURL: 'https://glowing-waddle-6vgj4v75xjxr2444x-3000.app.github.dev',
  withCredentials: true,
});

/**
 * @description Generate interview report from AI
 */
export const generateInterviewReport = async ({ resumeFile, selfdescription, jobdescription }) => {
  const formData = new FormData();

  if (resumeFile) {
    formData.append('resume', resumeFile);
  }

  formData.append('selfdescription', selfdescription ?? '');
  formData.append('jobdescription', jobdescription ?? '');

  const resp = await api.post('/api/interview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return resp.data;
};

/**
 * @description Get interview report by ID
 * @param {string} id - The ID of the interview report to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the interview report data.
 */
export const getInterviewReportById = async (id) => {
  const resp = await api.get(`/api/interview/report/${id}`);
  return resp.data;
};

/**
 * @description Get all interview reports by user ID
 * @param {string} userId - The ID of the user whose interview reports to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of interview reports.
 */
export const getAllinterviewReportsByUserId = async (userId) => {
  const resp = await api.get(`/api/interview/user/${userId}`);
  return resp.data;
};


//Service to generate resume pdf by Ai
export const generateresumepdf = async ({ interviewReportId }) => {
  const resp = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: 'blob',
  });

  return resp.data;
};