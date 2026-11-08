import { useState, useRef } from 'react';
import '../style/home.scss';

const Homepage = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ? file.name : null);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

        <div className='panel-grid'>
          <section className='left panel'>
            <label htmlFor='jobDescription' className='panel-label'>Job Description</label>
            <textarea
              name='jobDescription'
              id='jobDescription'
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
                    {selectedFile || 'No file selected'}
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
                ref={fileInputRef}
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
                placeholder='Write about your experience, strengths, and background...'
              />
            </div>

            <div className='input-group action-group'>
              <button type='submit' id='generateReport'>
                <span className='button-icon'>⚡</span>
                Generate Report
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Homepage;