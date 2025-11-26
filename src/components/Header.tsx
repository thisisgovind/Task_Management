import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-800/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Task Manager
          </p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Welcome back{user ? `, ${user.username}` : ''}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

