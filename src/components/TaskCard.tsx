import type { Task } from '../features/tasks/types'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const STATUS_STYLES: Record<
  Task['status'],
  { bg: string; text: string; label: string }
> = {
  todo: {
    bg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
    text: 'text-sky-700',
    label: 'To do',
  },
  'in-progress': {
    bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-100',
    text: 'text-amber-700',
    label: 'In progress',
  },
  done: {
    bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100',
    text: 'text-emerald-700',
    label: 'Completed',
  },
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const statusStyle = STATUS_STYLES[task.status]
  const created = new Date(task.createdAt).toLocaleDateString()
  const updated = new Date(task.updatedAt).toLocaleString()

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Created {created}
          </p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {task.title}
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle.bg}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-200">
        {task.description || 'No description provided.'}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <p>Updated {updated}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-500 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default TaskCard

