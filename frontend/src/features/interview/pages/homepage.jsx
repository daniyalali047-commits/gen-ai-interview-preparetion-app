import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import '../style/home.scss';
import { useInterviewhook } from '../hook/useinterview.js';

const Homepage = () => {
  const { loading, generatereport } = useInterviewhook();
  const navigate = useNavigate();
  const [jobdescription, setjobdescription] = useState('');
  const [selfdescription, setselfdescription] = useState('');
  const [generationError, setGenerationError] = useState('');
  const resumeinputref = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ?? null);
  };

  if (loading) {
    return (
      <main className='home'>
        <section className='generation-loading' role='status' aria-live='polite'>
          <span className='generation-spinner' aria-hidden='true' />
          <h1>Doing the magic</h1>
          <p>We’re reviewing your resume and preparing your interview report.</p>
        </section>
      </main>
    );
  }

  const clearSelectedFile = () => {
    setSelectedFile(null);

    if (resumeinputref.current) {
      resumeinputref.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGenerationError('');

    if (!jobdescription.trim() || !selfdescription.trim() || !selectedFile) {
      alert('Please add your job description, self description, and resume PDF before generating a report.');
      return;
    }

    try {
      const report = await generatereport({
        jobdescription,
        selfdescription,
        resumeFile: selectedFile,
      });
      const reportId = report._id ?? report.id;

      if (!reportId) {
        throw new Error('The report was generated, but no report ID was returned.');
      }

      navigate(`/interview/${reportId}`);
    } catch (error) {
      setGenerationError(
        error.response?.data?.message || error.message || 'Could not generate the report. Please try again.',
      );
    }
  };

  return (
    <main className='home'>
      <div className='workspace-shell'>
        <header className='workspace-header'>
          <div className='workspace-title-wrap'>
            <span className='spark-icon'>✦</span>
            <div>
              <p className='eyebrow'>Interview prep workspace</p>
              <h1>Generate a tailored interview report</h1>
            </div>
          </div>

          <div className='header-badges'>
            <span className='mini-badge'>AI review</span>
            <span className='mini-badge'>PDF-ready</span>
          </div>
        </header>

        <form className='panel-grid' onSubmit={handleSubmit}>
          <section className='left panel'>
            <label htmlFor='jobDescription' className='panel-label'>Job Description</label>
            <textarea
              name='jobDescription'
              id='jobDescription'
              value={jobdescription}
              onChange={(event) => setjobdescription(event.target.value)}
              placeholder='Paste the job description here...'
            />
          </section>

          <section className='right panel'>
            <div className='upload-block'>
              <label htmlFor='resume' className='panel-label'>Upload Resume</label>

              <div className='upload-row'>
                <label className='upload-button' htmlFor='resume'>
                  <span className='button-icon'>↑</span>
                  Upload Resume
                </label>

                <div className='file-pill'>
                  <span className='file-dot'>PDF</span>
                  <span className='selected-file-name'>
                    {selectedFile ? selectedFile.name : 'No file selected'}
                  </span>

                  {selectedFile && (
                    <button
                      type='button'
                      className='remove-file-btn'
                      onClick={clearSelectedFile}
                      aria-label='Remove selected file'
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <input
                ref={resumeinputref}
                type='file'
                name='resume'
                id='resume'
                accept='.pdf'
                onChange={handleFileChange}
              />
            </div>

            <div className='self-description'>
              <label htmlFor='selfDescription' className='panel-label'>Self Description</label>
              <textarea
                name='selfDescription'
                id='selfDescription'
                value={selfdescription}
                onChange={(event) => setselfdescription(event.target.value)}
                placeholder='Write about your experience, strengths, and background...'
              />
            </div>

            <div className='input-group action-group'>
              {generationError && <p className='generation-error' role='alert'>{generationError}</p>}
              <button type='submit' id='generateReport' disabled={loading}>
                <span className='button-icon'>⚡</span>
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
};

export default Homepage;