import { ArrowRight, CheckCircle2, ChevronDown, FileText, Play, RefreshCw, Search, Settings, WandSparkles } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { skillGaps, roadmap, jobs } from '../data/demoData'
import { ResumeAnalysis } from '../components/resume/ResumeAnalysis'
import { useEffect, useState } from 'react'
import { Assessment, createRoadmap, generateAssessment, JobSearchResult, loadAnalysis, ResumeAnalysis as Analysis, searchJobs } from '../lib/api'

type ModuleType = 'resume' | 'skill-gap' | 'assessments' | 'roadmap' | 'jobs' | 'interviews' | 'settings'
const content: Record<ModuleType, { title: string; description: string; icon: typeof FileText }> = {
  resume: { title: 'Resume intelligence', description: 'Upload your resume to extract skills and compare them to a target role.', icon: FileText },
  'skill-gap': { title: 'Skill gap analysis', description: 'See how your current capabilities align to your target role.', icon: WandSparkles },
  assessments: { title: 'Practical assessments', description: 'Validate your skills with challenges designed for your career path.', icon: CheckCircle2 },
  roadmap: { title: 'Learning roadmap', description: 'A focused plan to close your highest-impact skill gaps.', icon: RefreshCw },
  jobs: { title: 'Job matching', description: 'Discover opportunities ranked by your real skill alignment.', icon: Search },
  interviews: { title: 'Interview preparation', description: 'Build confidence with role-specific practice and feedback.', icon: Play },
  settings: { title: 'Settings', description: 'Manage your profile, preferences, and connected accounts.', icon: WandSparkles },
}

export function ModulePage({ type }: { type: ModuleType }) {
  const info = content[type]
  return (
    <div className="mx-auto max-w-[1100px] space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"><info.icon size={14} /> {type === 'resume' ? 'Live analysis' : 'Workspace tool'}</div>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{info.title}</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">{info.description}</p>
        </div>
        {type === 'roadmap' && <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900"><RefreshCw size={15} /> Regenerate plan</button>}
      </div>
      {type === 'resume' && <ResumeAnalysis />}
      {type === 'skill-gap' && <SkillGap />}
      {type === 'roadmap' && <Roadmap />}
      {type === 'jobs' && <Jobs />}
      {(type === 'assessments' || type === 'interviews') && <Practice type={type} />}
      {type === 'settings' && <Settings />}
    </div>
  )
}

function SkillGap() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  useEffect(() => { setAnalysis(loadAnalysis()) }, [])
  if (!analysis) return <Card><div className="py-10 text-center"><WandSparkles className="mx-auto text-indigo-500" size={28} /><h3 className="mt-4 font-display text-lg font-bold">Analyze your resume first</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Complete an analysis in Resume Analysis. This page will then show the same result broken into skill-gap details.</p></div></Card>
  const missing = analysis.skills.filter((skill) => !skill.found)
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Analyzed resume</p>
            <h3 className="mt-1 font-display text-xl font-bold">{analysis.target_role}</h3>
            <p className="mt-1 text-sm text-slate-500">{analysis.filename} · {analysis.verdict}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-3xl font-bold text-indigo-600">{analysis.match_score}%</p>
            <p className="text-xs text-slate-400">role match</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="font-display font-bold">Skills found in your resume</h3>
          <p className="mt-1 text-xs text-slate-400">Evidence detected during resume analysis.</p>
          <div className="mt-5 space-y-4">{analysis.skills.filter((skill) => skill.found).map((skill) => <div key={skill.name}><div className="mb-2 flex justify-between"><span className="text-sm font-semibold">{skill.name}</span><Badge tone="green">Evidence found</Badge></div><ProgressBar value={100} color="bg-emerald-500" /></div>)}</div>
        </Card>
        <Card>
          <h3 className="font-display font-bold">Skills to close</h3>
          <p className="mt-1 text-xs text-slate-400">Requirements not found in the analyzed resume.</p>
          <div className="mt-5 space-y-4">{missing.map((skill) => <div key={skill.name}><div className="mb-2 flex justify-between gap-3"><span className="text-sm font-semibold">{skill.name}</span><Badge tone={skill.weight >= .9 ? 'red' : 'amber'}>{skill.weight >= .9 ? 'High priority' : 'Medium priority'}</Badge></div><ProgressBar value={7} color="bg-red-400" /><p className="mt-2 text-xs leading-5 text-slate-500">{skill.why}</p></div>)}</div>
        </Card>
      </div>
      <Card>
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold">What to learn for {analysis.target_role}</h3>
          <p className="mt-1 text-sm text-slate-500">These recommendations are carried over from the resume analysis.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">{analysis.recommendations.map((item) => <details key={item.skill} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><summary className="cursor-pointer list-none"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">{item.skill.slice(0, 1)}</span><span className="flex-1 text-sm font-bold">{item.skill}</span><Badge tone={item.priority === 'High' ? 'amber' : 'slate'}>{item.priority}</Badge></div></summary><div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500 dark:border-slate-800"><p><strong>Duration:</strong> {item.duration}</p><p><strong>Topics:</strong> {item.topics.join(' · ')}</p><p><strong>Practice:</strong> {item.practice}</p><p><strong>Project:</strong> {item.project}</p></div></details>)}</div>
      </Card>
    </div>
  )
}
function Roadmap() {
  const [analysis] = useState(loadAnalysis())
  const [plan, setPlan] = useState<import('../lib/api').Roadmap | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { if (analysis) createRoadmap(analysis).then(setPlan).catch((reason) => setError(reason.message)) }, [analysis])
  if (!analysis) return <Card><p className="py-10 text-center text-sm text-slate-500">Analyze a resume first to generate a personalized roadmap.</p></Card>
  if (error) return <ErrorCard message={error} />
  if (!plan) return <Card><p className="py-10 text-center text-sm text-slate-500">Building your roadmap from the detected skill gaps...</p></Card>
  return <Card><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{plan.target_role} path</p><h3 className="mt-1 font-display text-xl font-bold">Your personalized roadmap</h3></div><Badge tone="indigo">{plan.total_weeks} focus weeks</Badge></div><div className="space-y-3">{plan.weeks.map((week) => <details key={week.week} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><summary className="cursor-pointer list-none"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">{week.week}</span><div className="flex-1"><p className="text-sm font-bold">{week.skill}</p><p className="mt-1 text-xs text-slate-400">{week.duration} · {week.priority} priority</p></div><ChevronDown size={16} className="text-slate-400" /></div></summary><div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 dark:border-slate-800"><p><strong>Objectives:</strong> {week.objectives.join(' · ')}</p><p><strong>Practice:</strong> {week.practice}</p><p><strong>Project:</strong> {week.project}</p></div></details>)}</div></Card>
}
function Jobs() {
  const [analysis] = useState(loadAnalysis())
  const [result, setResult] = useState<JobSearchResult | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { if (analysis) searchJobs(analysis).then(setResult).catch((reason) => setError(reason instanceof Error ? reason.message : 'Job search failed.')) }, [analysis])
  if (!analysis) return <Card><p className="py-10 text-center text-sm text-slate-500">Analyze a resume first to search for matching vacancies.</p></Card>
  if (error) return <ErrorCard message={error} />
  if (!result) return <Card><p className="py-10 text-center text-sm text-slate-500">Searching live vacancies for {analysis.target_role}...</p></Card>
  return <Card><div className="mb-5"><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Live vacancies · {result.source}</p><h3 className="mt-1 font-display text-xl font-bold">{result.count} results for {result.query}</h3><p className="mt-1 text-xs text-slate-400">Openings come directly from the public job feed. Skill match is not claimed until a full vacancy comparison is implemented.</p></div><div className="space-y-3">{result.jobs.map((job) => <a href={job.url} target="_blank" rel="noreferrer" key={job.id} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:border-indigo-500/30"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">{job.company?.slice(0, 1) ?? 'J'}</div><div className="min-w-0 flex-1"><h4 className="text-sm font-bold">{job.title}</h4><p className="mt-1 text-xs text-slate-500">{job.company || 'Company not listed'} · {job.location || 'Location not listed'}</p><p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">{job.description}</p></div><ArrowRight size={16} className="shrink-0 text-slate-400" /></div></a>)}</div></Card>
}
function Practice({ type }: { type: 'assessments' | 'interviews' }) {
  const [analysis] = useState(loadAnalysis())
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Record<string | number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const start = async () => { if (!analysis) return; setLoading(true); setError(''); try { setAssessment(await generateAssessment(analysis)) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Assessment generation failed.') } finally { setLoading(false) } }
  if (!analysis) return <Card><p className="py-10 text-center text-sm text-slate-500">Analyze a resume first to generate a gap-based assessment.</p></Card>
  if (error) return <ErrorCard message={error} />
  if (!assessment) return <Card><div className="py-8 text-center"><Play className="mx-auto text-indigo-500" size={28} /><h3 className="mt-4 font-display text-lg font-bold">{type === 'assessments' ? 'Assess your priority gaps' : 'Practice role-specific questions'}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">OpenAI will generate questions from the missing skills in your {analysis.target_role} analysis.</p><button onClick={start} disabled={loading} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Generating questions...' : 'Generate assessment'}</button></div></Card>
  const score = assessment.questions.filter((question) => selected[question.id] === question.answer_index).length
  return <Card><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{assessment.target_role} assessment</p><h3 className="mt-1 font-display text-xl font-bold">{submitted ? `${score}/${assessment.questions.length} correct` : `${assessment.questions.length} questions`}</h3></div><Badge tone="indigo">AI generated</Badge></div><div className="space-y-5">{assessment.questions.map((question, index) => <div key={question.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><div className="flex gap-3"><span className="text-xs font-bold text-indigo-600">{index + 1}</span><div className="flex-1"><div className="mb-2 flex gap-2"><Badge tone="slate">{question.skill}</Badge><Badge tone="slate">{question.difficulty}</Badge></div><p className="text-sm font-semibold leading-6">{question.prompt}</p><div className="mt-4 grid gap-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer gap-2 rounded-xl border p-3 text-xs ${selected[question.id] === optionIndex ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-700'}`}><input type="radio" name={`question-${question.id}`} checked={selected[question.id] === optionIndex} onChange={() => setSelected({ ...selected, [question.id]: optionIndex })} />{option}</label>)}</div>{submitted && <p className="mt-3 text-xs leading-5 text-slate-500"><strong>{selected[question.id] === question.answer_index ? 'Correct.' : `Correct answer: ${question.options[question.answer_index]}.`}</strong> {question.explanation}</p>}</div></div></div>)}</div>{!submitted && <button onClick={() => setSubmitted(true)} className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white">Submit assessment</button>}</Card>
}
function ErrorCard({ message }: { message: string }) { return <Card><div className="py-8 text-center"><p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{message}</p><p className="mt-2 text-xs text-slate-500">Configure the provider credentials in backend/.env, then restart FastAPI.</p></div></Card> }
