import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from '../features/tasks/tasksSlice'
import type { Task, TaskStatus } from '../features/tasks/types'
import { useAppDispatch, useAppSelector } from '../hooks'

type FilterOption = TaskStatus | 'all'

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
]

const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.tasks)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<FilterOption>('all')

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchTasks())
    }
  }, [dispatch, status])

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((task) => task.status === filter)
  }, [items, filter])

  const stats = useMemo(() => {
    return {
      total: items.length,
      todo: items.filter((task) => task.status === 'todo').length,
      inProgress: items.filter((task) => task.status === 'in-progress').length,
      done: items.filter((task) => task.status === 'done').length,
    }
  }, [items])

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleCreate = async (values: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    await dispatch(createTask(values)).unwrap()
    closeForm()
  }

  const handleUpdate = async (values: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return
    await dispatch(updateTask({ id: editingTask.id, changes: values })).unwrap()
    closeForm()
  }

  const handleDelete = (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    void dispatch(deleteTask(task.id))
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <section className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Overview
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.total} tasks
                </h2>
              </div>
              <div className="flex gap-2 rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold uppercase tracking-wide dark:border-slate-600 dark:bg-slate-900">
                {FILTERS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`rounded-full px-3 py-1 transition ${
                      filter === item.value
                        ? 'bg-brand text-white'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center dark:border-slate-700 dark:bg-slate-900/60">
                <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  To do
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                  {stats.todo}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center dark:border-slate-700 dark:bg-slate-900/60">
                <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  In progress
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                  {stats.inProgress}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center dark:border-slate-700 dark:bg-slate-900/60">
                <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Done
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                  {stats.done}
                </dd>
              </div>
            </dl>
          </div>

          {error ? (
            <ErrorBanner message={error} onRetry={() => dispatch(fetchTasks())} />
          ) : null}

          {status === 'loading' && items.length === 0 ? (
            <LoadingSpinner label="Fetching tasks" />
          ) : null}

          {filteredTasks.length === 0 && status !== 'loading' ? (
            <EmptyState
              title="No tasks yet"
              description="Use the form to create the first task and start tracking progress."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null)
                    setIsFormOpen(true)
                  }}
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark"
                >
                  Create a task
                </button>
              }
            />
          ) : null}

          {filteredTasks.length > 0 ? (
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : null}
        </section>

        <aside className="w-full max-w-md space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Planner
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingTask ? 'Edit task' : 'Create a task'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null)
                  setIsFormOpen((prev) => !prev)
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {isFormOpen ? 'Hide' : 'Show'}
              </button>
            </div>

            {isFormOpen ? (
              <div className="mt-6">
                <TaskForm
                  initialValues={editingTask ?? undefined}
                  onSubmit={editingTask ? handleUpdate : handleCreate}
                  onCancel={closeForm}
                  isSubmitting={status === 'loading'}
                />
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-300">
                Use the planner to create new tasks or to edit an existing one.
                Changes are synced with the mocked API instantly.
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default DashboardPage

