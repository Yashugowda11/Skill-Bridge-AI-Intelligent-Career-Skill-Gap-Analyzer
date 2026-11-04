const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

export type SkillResult = { name: string; status: string; found: boolean; weight: number; why: string }
export type StudyRecommendation = { skill: string; priority: string; reason: string; topics: string[]; practice: string; project: string; duration: string }
export type ResumeAnalysis = { filename: string; target_role: string; match_score: number; missing_count: number; sufficient: boolean; verdict: string; verdict_reason: string; what_to_add: string[]; skills: SkillResult[]; recommendations: StudyRecommendation[]; extracted_text: string }
export type Roadmap = { target_role: string; total_weeks: number; weeks: { week: number; skill: string; duration: string; priority: string; objectives: string[]; practice: string; project: string; completed: boolean }[] }
export type Assessment = { target_role: string; questions: { id: string | number; skill: string; difficulty: string; prompt: string; options: string[]; answer_index: number; explanation: string }[] }
export type JobSearchResult = { source: string; query: string; count: number; jobs: { id: string | number; title: string; company: string; location: string; description: string; url: string; salary_min?: number; salary_max?: number }[] }
const ANALYSIS_STORAGE_KEY = 'skillbridge:last-resume-analysis'

export function saveAnalysis(analysis: ResumeAnalysis) { localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysis)) }
export function loadAnalysis(): ResumeAnalysis | null { const value = localStorage.getItem(ANALYSIS_STORAGE_KEY); return value ? JSON.parse(value) as ResumeAnalysis : null }

export async function getRoles(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/roles`)
  if (!response.ok) throw new Error('Unable to load target roles.')
  return (await response.json()).roles
}

async function postJson<T>(path: string, value: unknown): Promise<T> { const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.detail ?? 'The request failed.'); return payload as T }
export function createRoadmap(analysis: ResumeAnalysis) { return postJson<Roadmap>('/roadmap', analysis) }
export function generateAssessment(analysis: ResumeAnalysis) { return postJson<Assessment>('/assessments/generate', analysis) }
export function searchJobs(analysis: ResumeAnalysis, country = '') { return postJson<JobSearchResult>('/jobs/search', { role: analysis.target_role, skills: analysis.skills.filter((skill) => skill.found).map((skill) => skill.name), country }) }

export async function analyzeResume(file: File, role: string): Promise<ResumeAnalysis> {
  const body = new FormData()
  body.append('file', file)
  body.append('role', role)
  const response = await fetch(`${API_BASE_URL}/resume/analyze`, { method: 'POST', body })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.detail ?? 'Resume analysis failed.')
  return payload
}
