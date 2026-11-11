import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../style/interview.scss';
import { useInterviewhook } from '../hook/useinterview.js'


const QuestionList = ({ title, questions, type }) => (
  <section className='report-section' aria-labelledby={`${type}-heading`}>
    <div className='section-heading'>
      <div>
        <p className='section-kicker'>{type === 'technical' ? 'Skills in practice' : 'Your experience'}</p>
        <h2 id={`${type}-heading`}>{title}</h2>
      </div>
      <span className='section-count'>{questions.length} questions</span>
    </div>

    {questions.length ? (
      <div className='question-list'>
        {questions.map(({ question, intention, answer }, index) => (
          <article className='question-card' key={`${type}-${index}`}>
            <div className='question-number'>{String(index + 1).padStart(2, '0')}</div>
            <div className='question-content'>
              <h3>{question}</h3>
              {intention && (
                <p className='question-intention'>
                  <span>What they’re assessing</span>
                  {intention}
                </p>
              )}
              {answer && (
                <details className='answer-details'>
                  <summary>View suggested answer</summary>
                  <p>{answer}</p>
                </details>
              )}
            </div>
          </article>
        ))}
      </div>
    ) : (
      <p className='section-empty'>No questions available yet.</p>
    )}
  </section>
);

const PreparationPlan = ({ days }) => (
  <section className='report-section preparation-section' aria-labelledby='preparation-plan-heading'>
    <div className='section-heading'>
      <div>
        <p className='section-kicker'>One step at a time</p>
        <h2 id='preparation-plan-heading'>Your preparation plan</h2>
      </div>
      <span className='section-count'>{days.length} days</span>
    </div>
    {days.length ? (
      <ol className='plan-list'>
        {days.map(({ day, focus, tasks }, index) => (
          <li className='plan-day' key={`${day ?? index}-${index}`}>
            <div className='plan-day-marker'>
              <span>{day ?? index + 1}</span>
            </div>
            <div className='plan-day-content'>
              <p className='plan-day-label'>Day {day ?? index + 1}</p>
              <h3>{focus}</h3>
              {Array.isArray(tasks) && tasks.length > 0 && (
                <ul className='task-list'>
                  {tasks.map((task, taskIndex) => (
                    <li key={`${taskIndex}-${task}`}>{task}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <p className='section-empty'>Your preparation plan will appear here.</p>
    )}
  </section>
);

const Interview = () => {
  const [activeSection, setActiveSection] = useState('technical');
  const [loadError, setLoadError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const { interviewId } = useParams();
  const { report, loading, getreportbyid, resumepdf } = useInterviewhook();

  const handleResumeDownload = async () => {
    setDownloadError('');
    setIsDownloadingResume(true);
    try {
      await resumepdf(interviewId);
    } catch (error) {
      setDownloadError(error.response?.data?.message || error.message || 'Could not download the resume PDF.');
    } finally {
      setIsDownloadingResume(false);
    }
  };

  useEffect(() => {
    if (String(report?._id ?? report?.id ?? '') === interviewId) {
      return;
    }

    getreportbyid(interviewId).catch((error) => {
      setLoadError(error.response?.data?.message || error.message || 'Could not load this interview report.');
    });
  }, [getreportbyid, interviewId, report?._id, report?.id]);

  const data = String(report?._id ?? report?.id ?? '') === interviewId ? report : null;
  const score = data?.matchScore != null && Number.isFinite(Number(data.matchScore))
    ? Math.min(100, Math.max(0, Number(data.matchScore)))
    : null;
  const technicalQuestions = Array.isArray(data?.technicalQuestions) ? data.technicalQuestions : [];
  const behavioralQuestions = Array.isArray(data?.behavioralQuestions) ? data.behavioralQuestions : [];
  const skillGaps = Array.isArray(data?.skillGaps) ? data.skillGaps : [];
  const preparationPlan = Array.isArray(data?.preparationPlan) ? data.preparationPlan : [];
  const sections = [
    { id: 'technical', label: 'Technical questions', count: technicalQuestions.length, icon: '⌘' },
    { id: 'behavioral', label: 'Behavioral questions', count: behavioralQuestions.length, icon: '◉' },
    { id: 'plan', label: 'Preparation plan', count: preparationPlan.length, icon: '↗' },
  ];

  return (
    <main className='interview-page'>
      {isDownloadingResume && (
        <div className='resume-loading-overlay' role='status' aria-live='polite'>
          <div className='resume-loading-dialog'>
            <span className='resume-loading-spinner' aria-hidden='true' />
            <h2>Generating your resume</h2>
            <p>Please wait while we prepare your PDF.</p>
          </div>
        </div>
      )}
      <div className='interview-shell'>
        <header className='interview-header'>
          <div className='interview-brand'>
            <span className='interview-brand-icon' aria-hidden='true'>✦</span>
            <span>Interview prep</span>
          </div>
          <span className='report-status'><span aria-hidden='true' /> Personalised report</span>
        </header>

        {loading && !data ? (
          <section className='report-empty' role='status' aria-live='polite'>
            <span className='empty-icon' aria-hidden='true'>✦</span>
            <h1>Loading your report</h1>
            <p>Please wait while we fetch your interview report.</p>
          </section>
        ) : loadError ? (
          <section className='report-empty' role='alert'>
            <h1>Could not load this report</h1>
            <p>{loadError}</p>
          </section>
        ) : !data ? (
          <section className='report-empty' aria-live='polite'>
            <span className='empty-icon' aria-hidden='true'>✦</span>
            <h1>Your interview report is on its way</h1>
            <p>Your questions, skill gaps, and preparation plan will appear here once your report is ready.</p>
          </section>
        ) : (
          <>
            <section className='report-hero'>
              <div className='hero-copy'>
                <p className='hero-eyebrow'>Your personalised report</p>
                <h1>A clearer path to interview-ready</h1>
                <p className='hero-description'>
                  Review your tailored questions, focus areas, and day-by-day preparation plan.
                </p>
              </div>
              <div className='score-card' aria-label={score === null ? 'Match score unavailable' : `Match score: ${score}%`}>
                <div
                  className={`score-ring${score === null ? ' score-ring-unavailable' : ''}`}
                  style={score === null ? undefined : { '--score-angle': `${score * 3.6}deg` }}
                >
                  <div className='score-ring-center'>
                    <strong>{score === null ? '—' : `${score}%`}</strong>
                    <span>match</span>
                  </div>
                </div>
                <div className='score-copy'>
                  <strong>{score === null ? 'Score pending' : 'Profile match'}</strong>
                  <span>{score === null ? 'Your score will show here' : 'You’re starting from a strong place'}</span>
                </div>
              </div>
            </section>

            <div className='report-content'>
              <nav className='report-navigation' aria-label='Interview report sections'>
                <p className='navigation-label'>Your report</p>
                {sections.map(({ id, label, count, icon }) => (
                  <button
                    className={`navigation-item${activeSection === id ? ' is-active' : ''}`}
                    type='button'
                    key={id}
                    aria-current={activeSection === id ? 'page' : undefined}
                    onClick={() => setActiveSection(id)}
                  >
                    <span className='navigation-icon' aria-hidden='true'>{icon}</span>
                    <span className='navigation-text'>{label}</span>
                    <span className='navigation-count'>{count}</span>
                  </button>
                ))}
              </nav>

              <div className='section-content'>
                {activeSection === 'technical' && (
                  <QuestionList title='Technical questions' questions={technicalQuestions} type='technical' />
                )}
                {activeSection === 'behavioral' && (
                  <QuestionList title='Behavioral questions' questions={behavioralQuestions} type='behavioral' />
                )}
                {activeSection === 'plan' && <PreparationPlan days={preparationPlan} />}
              </div>

              <aside className='insights-column'>
                <section className='side-card skill-card' aria-labelledby='skill-gaps-heading'>
                  <div className='side-card-heading'>
                    <div className='side-card-icon' aria-hidden='true'>⌁</div>
                    <div>
                      <p className='section-kicker'>Where to focus</p>
                      <h2 id='skill-gaps-heading'>Skill gaps</h2>
                    </div>
                  </div>
                  {skillGaps.length ? (
                    <ul className='skill-list'>
                      {skillGaps.map(({ skill, severity }, index) => {
                        const normalizedSeverity = typeof severity === 'string' ? severity.toLowerCase() : '';
                        const level = ['low', 'medium', 'high'].includes(normalizedSeverity)
                          ? normalizedSeverity
                          : 'unspecified';

                        return (
                          <li className='skill-item' key={`${skill}-${index}`}>
                            <span>{skill}</span>
                            <span className={`severity severity-${level}`}>
                              {level === 'unspecified' ? 'Review' : level}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className='side-empty'>No skill gaps to show.</p>
                  )}
                 
                </section>
                 <button
                 type="button"
                 onClick={handleResumeDownload}
                 disabled={loading || isDownloadingResume}
  className="button"
>
  <svg
    height="1rem"
    style={{ marginRight: '0.3rem', marginBottom: '0.2rem' }}
    xmlns='http://www.w3.org/2000/svg'
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
  </svg>
  <span>{isDownloadingResume ? 'Generating resume PDF…' : 'Download AI Generated Resume'}</span>
</button>
                {downloadError && <p role='alert'>{downloadError}</p>}

              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Interview;
