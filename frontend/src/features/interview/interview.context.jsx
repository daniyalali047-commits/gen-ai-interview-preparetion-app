import { createContext, useState } from 'react';

export const interviewcontext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [report, setreport] = useState(null);
  const [reports, setreports] = useState([]);

  return (
    <interviewcontext.Provider value={{ loading, setloading, report, setreport, reports, setreports }}>
      {children}
    </interviewcontext.Provider>
  );
};

export const interviewProvider = InterviewProvider;