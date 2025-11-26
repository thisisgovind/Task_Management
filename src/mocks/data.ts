import type { Task } from '../features/tasks/types'

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Wireframes for onboarding',
    description: 'Sketch the first iteration of the onboarding journey.',
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Define success metrics',
    description: 'Agree on KPIs to measure the beta launch.',
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'QA checklist',
    description: 'Document test scenarios for critical paths.',
    status: 'done',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let tasksDb: Task[] = [...sampleTasks]

const generateId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 11)
}

export const tasksStore = {
  all: () => tasksDb,
  create: (payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const timestamp = new Date().toISOString()
    const task: Task = {
      ...payload,
      id: generateId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    tasksDb = [task, ...tasksDb]
    return task
  },
  update: (
    id: string,
    payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Task | null => {
    const index = tasksDb.findIndex((task) => task.id === id)
    if (index === -1) return null
    const updated: Task = {
      ...tasksDb[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    tasksDb[index] = updated
    return updated
  },
  remove: (id: string) => {
    const exists = tasksDb.some((task) => task.id === id)
    tasksDb = tasksDb.filter((task) => task.id !== id)
    return exists
  },
}

type UserRecord = {
  username: string
  password: string
}

let usersDb: UserRecord[] = [
  {
    username: 'test',
    password: 'test123',
  },
]

export const usersStore = {
  find: (username: string) => usersDb.find((user) => user.username === username),
  create: (username: string, password: string) => {
    const exists = usersDb.some((user) => user.username === username)
    if (exists) {
      return null
    }

    const record: UserRecord = { username, password }
    usersDb = [...usersDb, record]
    return record
  },
}

