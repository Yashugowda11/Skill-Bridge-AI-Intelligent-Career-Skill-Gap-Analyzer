# SkillBridge AI

SkillBridge AI is a career intelligence platform for understanding skill readiness, validating practical competency, and building a focused path to job readiness.

## Current milestone: working resume analysis

The application now includes a responsive React + Vite + TypeScript shell and a FastAPI resume analysis service with:

- Responsive sidebar navigation and mobile navigation drawer
- Light/dark mode
- Overview dashboard with Recharts analytics
- Resume intelligence upload experience
- Skill gap analysis view
- Practical assessments and interview preparation entry points
- Learning roadmap progress view
- Job matching view
- Settings/profile view
- PDF, DOCX, PNG, JPG, and JPEG resume upload
- PDF text extraction and OCR fallback for scanned PDFs/images
- Target-role skill matching for the supported roles
- Transparent match score, missing skills, evidence status, and recommendations

The dashboard still contains illustrative dashboard content, but resume analysis is processed by the backend and is not a fake upload interaction.

## Run locally

Requirements: Node.js 20+ and npm.

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

Start the real analysis API in a second PowerShell terminal. Python 3.11+ is recommended:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API health check is available at `http://127.0.0.1:8000/api/health`.

## Live provider setup

Copy `backend/.env.example` to `backend/.env` and add:

- `OPENAI_API_KEY` to generate assessments from the analyzed missing skills.
- Job matching uses the public Arbeitnow vacancy feed and does not require credentials.

The learning roadmap is generated from the real analysis recommendations without an external provider. Assessments require `OPENAI_API_KEY`; job matching uses live results from Arbeitnow without an application key.

For image resumes or scanned PDFs, install the Tesseract OCR executable separately and ensure `tesseract.exe` is on PATH. Text-based PDFs do not need OCR.

Create a local `.env` from `.env.example` when the backend is available:

```powershell
Copy-Item .env.example .env
```

## Planned backend milestones

1. FastAPI service with JWT authentication and role-based authorization.
2. PostgreSQL models and Alembic migrations for candidates, skills, roles, jobs, assessments, roadmaps, and interviews.
3. Resume extraction using PyMuPDF and python-docx, with editable extraction results.
4. Semantic skill matching using sentence-transformers and transparent gap explanations.
5. Assessment scoring, roadmap generation, and permitted live job feeds.
6. Recruiter and administrator workflows, API integration, automated tests, and deployment documentation.

The backend must keep API keys server-side, validate uploads and forms, paginate collection endpoints, and distinguish live data from sample/demo data.
