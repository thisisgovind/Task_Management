import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/Dashboard'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import ProtectedRoute from './routes/ProtectedRoute'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App

