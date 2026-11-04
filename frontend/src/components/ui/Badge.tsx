type Tone = 'indigo' | 'green' | 'amber' | 'red' | 'slate'
const styles: Record<Tone, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/20',
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20',
  red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/70 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/20',
  slate: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/70 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600',
}
export function Badge({ children, tone = 'slate' }: { children: React.ReactNode; tone?: Tone }) { return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[tone]}`}>{children}</span> }
