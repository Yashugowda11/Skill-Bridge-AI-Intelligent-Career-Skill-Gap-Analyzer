export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.04)] transition-shadow duration-200 hover:shadow-[0_16px_45px_rgba(15,23,42,.08)] dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-[0_16px_45px_rgba(0,0,0,.2)] ${className}`}>{children}</section>
}
