import { delay, http, HttpResponse } from 'msw'
import { tasksStore, usersStore } from './data'

const FAKE_TOKEN = 'demo-jwt-token'

const ensureAuth = (request: Request) => {
  const header = request.headers.get('authorization')
  if (header !== `Bearer ${FAKE_TOKEN}`) {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as {
      username: string
      password: string
    }
    await delay(500)

    const user = usersStore.find(body.username)
    if (user && user.password === body.password) {
      return HttpResponse.json({
        token: FAKE_TOKEN,
        user: { username: body.username },
      })
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  http.post('/api/signup', async ({ request }) => {
    const body = (await request.json()) as {
      username: string
      password: string
    }
    await delay(500)

    if (!body.username.trim() || !body.password.trim()) {
      return HttpResponse.json(
        { message: 'Username and password are required' },
        { status: 400 },
      )
    }

    const created = usersStore.create(body.username, body.password)
    if (!created) {
      return HttpResponse.json({ message: 'Username already taken' }, { status: 409 })
    }

    return HttpResponse.json({
      token: FAKE_TOKEN,
      user: { username: body.username },
    })
  }),

  http.get('/api/tasks', async ({ request }) => {
    const authError = ensureAuth(request)
    if (authError) return authError
    await delay(300)
    return HttpResponse.json(tasksStore.all())
  }),

  http.post('/api/tasks', async ({ request }) => {
    const authError = ensureAuth(request)
    if (authError) return authError
    const payload = (await request.json()) as {
      title: string
      description: string
      status: string
    }
    await delay(250)
    const created = tasksStore.create({
      title: payload.title,
      description: payload.description,
      status: payload.status as any,
    })
    return HttpResponse.json(created, { status: 201 })
  }),

  http.put('/api/tasks/:id', async ({ params, request }) => {
    const authError = ensureAuth(request)
    if (authError) return authError
    const id = params.id as string
    const payload = (await request.json()) as {
      title: string
      description: string
      status: string
    }
    await delay(250)
    const updated = tasksStore.update(id, {
      title: payload.title,
      description: payload.description,
      status: payload.status as any,
    })
    if (!updated) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  http.delete('/api/tasks/:id', async ({ params, request }) => {
    const authError = ensureAuth(request)
    if (authError) return authError
    const id = params.id as string
    await delay(200)
    const removed = tasksStore.remove(id)
    if (!removed) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    }
    return HttpResponse.json({ id })
  }),
]

