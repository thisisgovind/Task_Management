import { useEffect, useState } from 'react'
import { useNavigate, useLocation, type Location, Link } from 'react-router-dom'
import { loginUser } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks'

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAppSelector((state) => state.auth)

  const [credentials, setCredentials] = useState({
    username: 'test',
    password: 'test123',
  })

  useEffect(() => {
    if (auth.token) {
      const redirectPath =
        (location.state as { from?: Location })?.from?.pathname ?? '/app'
      navigate(redirectPath, { replace: true })
    }
  }, [auth.token, location.state, navigate])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await dispatch(loginUser(credentials))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-slate-900 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
          Mocked API Demo
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Task Management</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Sign in with the demo account to explore the dashboard.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-mono text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
          <p>username: test</p>
          <p>password: test123</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {auth.error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {auth.error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={auth.status === 'loading'}
            className="w-full rounded-2xl bg-brand px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:bg-brand-dark disabled:opacity-60"
          >
            {auth.status === 'loading' ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-300">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-brand hover:text-brand-dark">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

