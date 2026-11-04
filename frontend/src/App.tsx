import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { ModulePage } from './pages/ModulePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/resume" element={<ModulePage type="resume" />} />
        <Route path="/skill-gap" element={<ModulePage type="skill-gap" />} />
        <Route path="/assessments" element={<ModulePage type="assessments" />} />
        <Route path="/roadmap" element={<ModulePage type="roadmap" />} />
        <Route path="/jobs" element={<ModulePage type="jobs" />} />
        <Route path="/interviews" element={<ModulePage type="interviews" />} />
        <Route path="/settings" element={<ModulePage type="settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
