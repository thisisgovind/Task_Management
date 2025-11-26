import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type Credentials = {
  username: string
  password: string
}

type AuthUser = {
  username: string
}

type AuthResponse = {
  token: string
  user: AuthUser
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const STORAGE_KEY = 'tm_auth'

const loadAuth = (): AuthResponse | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthResponse) : null
  } catch {
    return null
  }
}

const persistAuth = (payload: AuthResponse | null) => {
  if (typeof window === 'undefined') return
  if (!payload) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const persisted = loadAuth()

const initialState: AuthState = {
  token: persisted?.token ?? null,
  user: persisted?.user ?? null,
  status: 'idle',
  error: null,
}

const authenticate = async (endpoint: '/api/login' | '/api/signup', credentials: Credentials) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorBody = await response.json()
    throw new Error(errorBody.message ?? 'Authentication failed')
  }

  return (await response.json()) as AuthResponse
}

export const loginUser = createAsyncThunk<
  AuthResponse,
  Credentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authenticate('/api/login', credentials)
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Unable to login',
    )
  }
})

export const registerUser = createAsyncThunk<
  AuthResponse,
  Credentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    return await authenticate('/api/signup', credentials)
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Unable to sign up',
    )
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
      persistAuth(null)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        persistAuth(action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        persistAuth(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Signup failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

