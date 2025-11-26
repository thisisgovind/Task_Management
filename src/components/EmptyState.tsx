import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
        Nothing here yet
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export default EmptyState

