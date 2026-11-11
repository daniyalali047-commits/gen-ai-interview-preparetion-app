# GenAI Interview Preparation

GenAI Interview Preparation is a full-stack interview-preparation app. Users can create an account, submit a resume PDF and job details, and receive an AI-generated interview report with a match score, interview questions, skill gaps, and a preparation plan. The app can also generate a tailored resume PDF from a saved report.

## Features

- Account registration, login, logout, and authenticated pages
- Resume PDF upload (up to 3 MB) and text extraction
- AI-generated interview report, including:
  - Resume-to-job match score
  - Technical and behavioral questions with suggested answers
  - Skill gaps with low, medium, or high severity
  - Day-by-day preparation plan
- Saved reports list and report detail page
- AI-generated resume PDF download
- Loading and error states for report generation and downloads

AI-generated content is a draft for preparation purposes. Review it for accuracy before relying on or sharing it.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Vite, Axios, Sass |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| AI | Google Gemini via `@google/genai` |
| Documents | `pdf-parse` for uploaded resume text extraction; PDFKit for generated PDFs |
| Authentication | bcrypt password hashing, JWT in a cookie, token blacklist in MongoDB |

## Project layout

```text
.
├── backend/
│   ├── index.js                  # Loads environment, connects MongoDB, starts Express
│   └── src/
│       ├── app.js                # Express middleware and API router mounting
│       ├── config/database.js    # MongoDB connection
│       ├── controllers/          # Auth and interview request handlers
│       ├── middlewares/          # JWT authentication and resume upload handling
│       ├── models/               # User, report, and blacklisted-token schemas
│       ├── routes/               # Authentication and interview API routes
│       └── services/             # Gemini prompts, validation, and PDF generation
└── frontend/
    ├── index.html
    └── src/
        ├── app-routes.jsx         # Login, registration, workspace, report routes
        ├── features/
        │   ├── authenticaton/     # Auth context, pages, hooks, and API calls
        │   └── interview/         # Workspace, report UI, hooks, and API calls
        └── style/                 # Shared styles
```

## Requirements

- Node.js and npm (use a version compatible with the installed Vite release)
- A MongoDB instance, local or hosted
- A Google Gemini API key with access to the configured Gemini models

## Configuration

Create `backend/.env` with the following values:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/interview-prep
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_GEMINI_API=replace-with-your-Gemini-API-key
```

Keep `.env` files and API keys private; do not commit real credentials.

### API origin configuration

The frontend API services currently use a fixed GitHub Codespaces backend URL. The Express CORS configuration also allows a fixed Codespaces frontend origin. For local development or another deployment, update these values to match your frontend and backend:

- Backend base URL in `frontend/src/features/authenticaton/services/auth-api.js`
- Backend base URL in `frontend/src/features/interview/services/api.js`
- Allowed frontend origin in `backend/src/app.js`

For the default local Vite and Express ports, those origins are typically `http://localhost:5173` and `http://localhost:3000`, respectively. The backend currently listens on port `3000`.

## Run locally

Install dependencies in each app:

```bash
npm --prefix backend install
npm --prefix frontend install
```

Start the backend and frontend in separate terminals:

```bash
npm --prefix backend run dev
```

```bash
npm --prefix frontend run dev
```

Vite prints the frontend URL when it starts (normally `http://localhost:5173`). Open it in a browser after configuring the API URLs and CORS origin above. The backend loads `backend/.env` through `dotenv/config` and connects to MongoDB when it starts.

## How it works

1. A user registers or logs in. The backend hashes registration passwords with bcrypt and issues a JWT cookie for the session.
2. The protected workspace accepts a resume PDF, job description, and self-description.
3. The backend limits the upload to 3 MB, extracts text from the PDF, and sends that text and the descriptions to Gemini.
4. Gemini returns structured report data. The backend validates the response against a schema and saves the report in MongoDB.
5. The frontend displays the report and the user's saved report list.
6. When requested, the backend uses the saved resume text and descriptions to create a tailored resume PDF and returns it as a download.

The AI service tries configured fallback models and retries when Gemini responds with overload/rate-limit errors (HTTP 429 or 503).

## API reference

All routes are mounted under `/api`. Routes marked **Protected** require the JWT cookie set by login or registration. The frontend uses credentialed requests so the browser sends that cookie.

### Authentication

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account. JSON body: `{ "username": "...", "email": "...", "password": "..." }`. |
| `POST` | `/api/auth/login` | Public | Log in. JSON body: `{ "email": "...", "password": "..." }`. |
| `GET` | `/api/auth/logout` | Public | Log out, blacklist the current token, and clear the cookie. |
| `GET` | `/api/auth/get-me` | Protected | Return the current user's basic profile. |

### Interview reports

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/interview` | Protected | Generate and save an interview report. Send `multipart/form-data` with a `resume` PDF file, `jobdescription`, and `selfdescription`. |
| `GET` | `/api/interview/report/:id` | Protected | Fetch one report by its MongoDB ID. |
| `GET` | `/api/interview/user/:userId` | Protected | Fetch reports for the specified user ID. |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Protected | Generate and download a PDF resume from a saved report. |

The report includes a title, match score, question and answer sets, skill gaps, and a preparation plan. Empty report lists currently return `404`.

## Development checks

Frontend lint:

```bash
npm --prefix frontend run lint
```

Frontend production build:

```bash
npm --prefix frontend run build
```

There is currently no automated backend test suite. The backend package's `test` script is a placeholder that exits with an error.

## Data and deployment notes

- Uploaded resumes are processed in memory; extracted resume text and the supplied descriptions are stored with the generated report in MongoDB.
- Gemini credentials belong only in the backend environment, never in frontend code.
- The API URLs and CORS origin are currently tied to a Codespaces deployment. Update them before using a different local or production origin.
- Before production, configure deployment-appropriate cookie security settings, restrict report access to the owning user, and review the data retention and privacy requirements for uploaded resumes.
- Do not use generated resumes or interview advice without checking factual accuracy and removing information you do not want to share.
