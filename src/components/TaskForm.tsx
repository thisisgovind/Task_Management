import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import type { TaskStatus, Task } from '../features/tasks/types'

type TaskFormValues = {
  title: string
  description: string
  status: TaskStatus
}

type TaskFormProps = {
  initialValues?: Partial<Task>
  onSubmit: (values: TaskFormValues) => Promise<void> | void
  onCancel?: () => void
  isSubmitting?: boolean
}

const STATUS_OPTIONS: TaskStatus[] = ['todo', 'in-progress', 'done']

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
}

const TaskForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) => {
  const [values, setValues] = useState<TaskFormValues>(defaultValues)
  const [errors, setErrors] = useState<{ title?: string }>({})

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title ?? '',
        description: initialValues.description ?? '',
        status: initialValues.status ?? 'todo',
      })
    } else {
      setValues(defaultValues)
    }
  }, [initialValues])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, status: event.target.value as TaskStatus }))
  }

  const validate = () => {
    if (!values.title.trim()) {
      setErrors({ title: 'Title is required' })
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    void onSubmit(values)
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter a descriptive title"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-rose-500">{errors.title}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Description
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={3}
          placeholder="What needs to be done?"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Status
        </label>
        <select
          name="status"
          value={values.status}
          onChange={handleStatusChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {initialValues ? 'Update task' : 'Create task'}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default TaskForm

