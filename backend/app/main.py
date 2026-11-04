import os

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

from .analyzer import analyze_resume, extract_text
from .roles import ROLES
from .services import build_roadmap, generate_assessment, search_jobs

app = FastAPI(title="SkillBridge AI API", version="1.0.0")
origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173").split(",")]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class AnalysisContext(BaseModel):
    target_role: str
    skills: list[dict] = Field(default_factory=list)
    recommendations: list[dict] = Field(default_factory=list)


class JobSearchRequest(BaseModel):
    role: str
    skills: list[str] = Field(default_factory=list)
    country: str = ""


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/roles")
def roles() -> dict[str, list[str]]:
    return {"roles": list(ROLES.keys())}


@app.post("/api/resume/analyze")
async def analyze(file: UploadFile = File(...), role: str = Form(...)) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Choose a resume file first.")
    try:
        result = analyze_resume(extract_text(file.filename, await file.read()), role)
        result["filename"] = file.filename
        return result
    except (ValueError, RuntimeError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.post("/api/roadmap")
def roadmap(context: AnalysisContext) -> dict:
    if context.target_role not in ROLES:
        raise HTTPException(status_code=400, detail="Choose a supported target role.")
    return build_roadmap(context.model_dump())


@app.post("/api/assessments/generate")
async def assessments(context: AnalysisContext) -> dict:
    if context.target_role not in ROLES:
        raise HTTPException(status_code=400, detail="Choose a supported target role.")
    try:
        return await generate_assessment(context.model_dump())
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.post("/api/jobs/search")
async def jobs(request: JobSearchRequest) -> dict:
    try:
        return await search_jobs(request.role, request.skills, request.country)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
