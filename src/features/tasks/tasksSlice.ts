import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Task } from './types'

type TaskPayload = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

type TasksState = {
  items: Task[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const STORAGE_KEY = 'tm_tasks'

const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

const persistTasks = (tasks: Task[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

const initialState: TasksState = {
  items: loadTasks(),
  status: 'idle',
  error: null,
}

const withAuth = (state: RootState): Record<string, string> => {
  const token = state.auth.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
  'tasks/fetchAll',
  async (_, { getState }) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...withAuth(getState()),
    }

    const response = await fetch('/api/tasks', { headers })
    if (!response.ok) {
      throw new Error('Unable to load tasks')
    }
    return (await response.json()) as Task[]
  },
)

export const createTask = createAsyncThunk<
  Task,
  TaskPayload,
  { state: RootState }
>('tasks/create', async (payload, { getState }) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...withAuth(getState()),
  }

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Unable to create task')
  }

  return (await response.json()) as Task
})

export const updateTask = createAsyncThunk<
  Task,
  { id: string; changes: TaskPayload },
  { state: RootState }
>('tasks/update', async ({ id, changes }, { getState }) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...withAuth(getState()),
  }

  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(changes),
  })

  if (!response.ok) {
    throw new Error('Unable to update task')
  }

  return (await response.json()) as Task
})

export const deleteTask = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('tasks/delete', async (id, { getState }) => {
  const headers: HeadersInit = {
    ...withAuth(getState()),
  }

  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    throw new Error('Unable to delete task')
  }

  return id
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    seedTask: {
      reducer(state, action: PayloadAction<Task>) {
        state.items.push(action.payload)
      },
      prepare(partial: TaskPayload) {
        const now = new Date().toISOString()
        return {
          payload: {
            ...partial,
            id: nanoid(),
            createdAt: now,
            updatedAt: now,
          } as Task,
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.error = null
        persistTasks(state.items)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load tasks'
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        persistTasks(state.items)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id,
        )
        if (index !== -1) {
          state.items[index] = action.payload
          persistTasks(state.items)
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload)
        persistTasks(state.items)
      })
  },
})

export const { seedTask } = tasksSlice.actions
export default tasksSlice.reducer

