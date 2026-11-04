import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Activity, Bell, BookOpen, BriefcaseBusiness, ChevronDown, FileText, Gauge, GitBranch, Layers3, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Settings, Sun, Target, UserRound, X } from 'lucide-react'

const mainNavigation = [
  { to: '/', label: 'Overview', icon: Gauge },
  { to: '/resume', label: 'Resume analysis', icon: FileText },
  { to: '/skill-gap', label: 'Skill gaps', icon: Target },
  { to: '/assessments', label: 'Assessments', icon: Activity },
  { to: '/roadmap', label: 'Learning roadmap', icon: GitBranch },
  { to: '/jobs', label: 'Job matching', icon: BriefcaseBusiness },
]
const utilityNavigation = [{ to: '/interviews', label: 'Interview prep', icon: BookOpen }, { to: '/settings', label: 'Settings', icon: Settings }]

type NavigationItem = typeof mainNavigation[number]

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const location = useLocation()
  const currentPage = [...mainNavigation, ...utilityNavigation].find((item) => item.to === location.pathname)

  const renderNavigation = (items: NavigationItem[]) => items.map(({ to, label, icon: Icon }) => (
    <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white'}`}>
      <Icon size={18} strokeWidth={1.9} className="shrink-0" />
      <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
      {!collapsed && to === '/resume' && <span className="ml-auto rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">NEW</span>}
    </NavLink>
  ))

  return <div className={dark ? 'dark' : ''}>
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090d18] dark:text-slate-100">
      {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[274px] flex-col border-r border-slate-200/80 bg-white/95 px-3.5 py-5 shadow-[8px_0_30px_rgba(15,23,42,.03)] backdrop-blur-xl transition-all dark:border-slate-800 dark:bg-[#0d1220]/95 lg:translate-x-0 ${collapsed ? 'lg:w-[86px]' : ''} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2 pb-7">
          <NavLink to="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"><Layers3 size={19} /></span><span className={`font-display text-[17px] font-bold tracking-tight ${collapsed ? 'lg:hidden' : ''}`}>SkillBridge<span className="text-indigo-600">.</span></span></NavLink>
          <button aria-label="Close navigation" className="text-slate-400 lg:hidden" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>
        <div className={`mb-7 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/90 p-2.5 dark:border-slate-800 dark:bg-slate-800/60 ${collapsed ? 'lg:justify-center' : ''}`}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">AM</div><div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}><p className="truncate text-xs font-bold">Alex Morgan</p><p className="mt-0.5 text-[11px] text-slate-400">Student account</p></div><ChevronDown size={14} className={`ml-auto text-slate-400 ${collapsed ? 'lg:hidden' : ''}`} /></div>
        <p className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>Workspace</p>
        <nav className="space-y-1">{renderNavigation(mainNavigation)}</nav>
        <p className={`mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>More</p>
        <nav className="space-y-1">{renderNavigation(utilityNavigation)}</nav>
        <div className="mt-auto"><div className={`mb-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3.5 dark:border-indigo-500/20 dark:bg-indigo-500/10 ${collapsed ? 'lg:hidden' : ''}`}><div className="mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-300"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" /><span className="text-[11px] font-bold">Analysis service online</span></div><p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Upload a resume to discover your highest-impact next step.</p></div><button onClick={() => setCollapsed(!collapsed)} className="hidden w-full items-center justify-center gap-2 rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 lg:flex">{collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span className="text-xs">Collapse sidebar</span></>}</button></div>
      </aside>
      <main className={`min-h-screen transition-[padding] lg:pl-[274px] ${collapsed ? 'lg:pl-[86px]' : ''}`}>
        <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-slate-200/70 bg-slate-50/80 px-5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#090d18]/80 md:px-9">
          <div className="flex items-center gap-3"><button aria-label="Open navigation" className="text-slate-500 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button><div><p className="text-[11px] font-medium text-slate-400">Workspace <span className="mx-1">/</span> <span className="text-slate-600 dark:text-slate-300">{currentPage?.label ?? 'Overview'}</span></p><h1 className="mt-1 font-display text-lg font-bold tracking-tight md:text-xl">{currentPage?.label ?? 'Overview'}</h1></div></div>
          <div className="flex items-center gap-1.5"><button aria-label="Search" className="hidden rounded-xl p-2.5 text-slate-400 transition hover:bg-white hover:text-slate-700 md:block dark:hover:bg-slate-800"><Search size={18} /></button><button aria-label="Toggle dark mode" onClick={() => setDark(!dark)} className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-600 ring-2 ring-slate-50 dark:ring-[#090d18]" /></button><div className="mx-2 hidden h-7 w-px bg-slate-200 dark:bg-slate-800 md:block" /><button className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold transition hover:bg-white dark:hover:bg-slate-800 md:flex"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-100 text-[10px] text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">AM</span><ChevronDown size={14} className="text-slate-400" /></button></div>
        </header>
        <div className="app-background min-h-[calc(100vh-78px)] px-5 py-7 md:px-9 md:py-10"><Outlet /></div>
      </main>
    </div>
  </div>
}
