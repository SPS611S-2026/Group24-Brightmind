import { useState, useEffect } from 'react'
import { Home, Smile, BookOpen, Calendar, Bookmark, User as UserIcon, Clock, FileText, AlertTriangle, Users, BarChart, Bell } from 'lucide-react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ScreenRenderer from './components/ScreenRenderer'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import styles from './styles/App.module.css'
import * as api from './api'
import type { Role, User, NavItem, Appointment, MoodLog, Resource, SessionNote, Availability } from './types'

const navItems: Record<Role, NavItem[]> = {
  student: [
    { icon: <Home />, label: 'Dashboard', page: 'student-dashboard' },
    { icon: <Smile />, label: 'Mood Check-in', page: 'mood-checkin' },
    { icon: <BookOpen />, label: 'Resource Library', page: 'resource-library' },
    { icon: <Calendar />, label: 'Appointments', page: 'appointments' },
    { icon: <Bookmark />, label: 'Bookmarks', page: 'bookmarks' },
    { icon: <UserIcon />, label: 'Profile', page: 'profile' },
  ],
  counsellor: [
    { icon: <Home />, label: 'Dashboard', page: 'counsellor-dashboard' },
    { icon: <Calendar />, label: 'Appointment Calendar', page: 'appointment-calendar' },
    { icon: <Clock />, label: 'Set Availability', page: 'set-availability' },
    { icon: <FileText />, label: 'Session Notes', page: 'session-notes' },
    { icon: <AlertTriangle />, label: 'Urgent Flags', page: 'urgent-flags' },
    { icon: <UserIcon />, label: 'Profile', page: 'profile' },
  ],
  admin: [
    { icon: <Home />, label: 'Dashboard', page: 'admin-dashboard' },
    { icon: <Users />, label: 'Manage Users', page: 'manage-users' },
    { icon: <BarChart />, label: 'Aggregate Wellness', page: 'aggregate-wellness' },
    { icon: <BookOpen />, label: 'Manage Resources', page: 'manage-resources' },
    { icon: <Bell />, label: 'Notifications', page: 'system-notifications' },
    { icon: <UserIcon />, label: 'Profile', page: 'profile' },
  ],
}

const defaultUsers: Record<Role, User> = {
  student: { id: '', name: 'Guest', role: 'student', email: '', faculty: '' },
  counsellor: { id: '', name: 'Guest', role: 'counsellor', email: '', faculty: '' },
  admin: { id: '', name: 'Admin', role: 'admin', email: '', faculty: '' },
}

const defaultResources: Resource[] = []

const roleNames: Record<Role, string> = {
  student: 'Student',
  counsellor: 'Counsellor',
  admin: 'Administrator',
}

function readStoredUser(): User | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null
    }
    const raw = localStorage.getItem('mh_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function saveSession(token: string, user: User) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem('mh_auth_token', token)
  localStorage.setItem('mh_user', JSON.stringify(user))
}

function clearSession() {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.removeItem('mh_auth_token')
  localStorage.removeItem('mh_user')
}

type AppView = 'landing' | 'auth' | 'app'

type AuthMode = 'login' | 'register'

type AuthFormData = {
  mode: AuthMode
  name: string
  email: string
  password: string
  role: Role
  institutionCode: string
}

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<Role>('student')
  const [currentPage, setCurrentPage] = useState('student-dashboard')
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers.student)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])

  const loadData = async (token: string, userId?: string) => {
    try {
      const [appts, logs, res, notes, avail, profiles] = await Promise.all([
        api.getAppointments(token, userId),
        api.getMoodLogs(token, userId),
        api.getResources(token, userId),
        api.getSessionNotes(token, userId),
        api.getAvailability(token, userId),
        api.getProfiles(token, userId),
      ])

      setAppointments(Array.isArray(appts) ? appts : [])
      setMoodLogs(Array.isArray(logs) ? logs : [])
      setResources(Array.isArray(res) ? res : [])
      setSessionNotes(Array.isArray(notes) ? notes : [])
      setAvailability(Array.isArray(avail) ? avail : [])
      setUsers(Array.isArray(profiles) ? profiles.map(profileToUser) : [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const profileToUser = (profile: any): User => ({
    id: profile.id,
    institutionCode: profile.institution_code,
    auth_id: profile.id,
    name: profile.name,
    role: profile.role,
    email: profile.email,
    faculty: profile.faculty,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('mh_auth_token')
    const storedUser = readStoredUser()
    if (storedToken) {
      setAuthToken(storedToken)
    }
    if (storedToken && storedUser) {
      setCurrentUser(storedUser)
      setCurrentRole(storedUser.role)
      setCurrentPage(`${storedUser.role}-dashboard`)
      setView('app')
    }
  }, [])

  useEffect(() => {
    const restoreSession = async () => {
      if (!authToken || !currentUser.id) return
      try {
        await loadData(authToken, currentUser.id)
        setView('app')
      } catch (error) {
        console.error('Error loading data in restore session:', error)
        // Don't clear the token just because data failed to load
        // The user might still be able to access the app
      }
    }

    restoreSession()
  }, [authToken, currentUser.id])

  useEffect(() => {
    if (!authToken || !currentUser.id) return

    const refreshTimer = window.setInterval(() => {
      void loadData(authToken, currentUser.id)
    }, 15000)

    return () => window.clearInterval(refreshTimer)
  }, [authToken, currentUser.id])

  const currentRoleName = roleNames[currentRole]
  const items = navItems[currentRole]

  const handleNavigate = (page: string) => {
    if (page === 'logout') {
      handleLogout()
      return
    }
    setCurrentPage(page)
  }

  const handleLogout = () => {
    clearSession()
    setAuthToken(null)
    setView('landing')
    setCurrentRole('student')
    setCurrentPage('student-dashboard')
    setCurrentUser(defaultUsers.student)
  }

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setView('auth')
  }

  const handleAuthSubmit = async (data: AuthFormData) => {
    setAuthError(null)

    try {
      if (data.mode === 'login') {
        const result = await api.login(data.email, data.password, data.role)
        const token = result.token ?? result.session?.access_token
        if (!token) {
          setAuthError('Login failed. No token returned.')
          return
        }

        const profile = result.user
        const loggedUser = profileToUser(profile)
        saveSession(token, loggedUser)
        setAuthToken(token)
        setCurrentUser(loggedUser)
        setCurrentRole(loggedUser.role)
        setCurrentPage(`${loggedUser.role}-dashboard`)
        setView('app')
        return
      }

      await api.registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        faculty: data.role === 'student' ? 'Computing' : undefined,
        institution_code: data.institutionCode || undefined,
      })

      const loginResult = await api.login(data.email, data.password, data.role)
      const token = loginResult.token ?? loginResult.session?.access_token
      if (!token) {
        setAuthError('Registration failed. No token returned.')
        return
      }
      const profile = loginResult.user
      const loggedUser = profileToUser(profile)
      saveSession(token, loggedUser)
      setAuthToken(token)
      setCurrentUser(loggedUser)
      setCurrentRole(loggedUser.role)
      setCurrentPage(`${loggedUser.role}-dashboard`)
      setView('app')
    } catch (error) {
      setAuthError((error as Error).message)
    }
  }

  const handleAddAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
    if (!authToken) return
    const created = await api.addAppointment(appointment, authToken, currentUser.id)
    setAppointments(prev => [...prev, created])
  }

  const handleAddMoodLog = async (moodLog: Omit<MoodLog, 'id' | 'created_at'>) => {
    if (!authToken) {
      throw new Error('Not authenticated. Please log in.')
    }
    try {
      const created = await api.addMoodLog(moodLog, authToken, currentUser.id)
      setMoodLogs(prev => [...prev, created])
      return created
    } catch (error) {
      console.error('Error adding mood log:', error)
      throw error
    }
  }

  const handleAddResource = async (resource: Omit<Resource, 'id' | 'created_at'>) => {
    if (!authToken) return
    const created = await api.addResource(resource, authToken, currentUser.id)
    setResources(prev => [...prev, created])
  }

  const handleAddSessionNote = async (sessionNote: Omit<SessionNote, 'id' | 'created_at'>) => {
    if (!authToken) return
    const created = await api.addSessionNote(sessionNote, authToken, currentUser.id)
    setSessionNotes(prev => [...prev, created])
  }

  const handleAddAvailability = async (avail: Omit<Availability, 'id' | 'created_at'>) => {
    if (!authToken) return
    try {
      const created = await api.addAvailability(avail, authToken, currentUser.id)
      setAvailability(prev => [...prev, created])
    } catch (error) {
      console.error('Error adding availability:', error)
    }
  }

  const handleDeleteAvailability = async (availabilityId: string) => {
    if (!authToken) return
    try {
      await api.deleteAvailability(availabilityId, authToken, currentUser.id)
      setAvailability(prev => prev.filter(a => a.id !== availabilityId))
    } catch (error) {
      console.error('Error deleting availability:', error)
    }
  }

  const handleUpdateAvailability = async (availabilityId: string, updates: Partial<Omit<Availability, 'id'>>) => {
    if (!authToken) return
    try {
      const updated = await api.updateAvailability(availabilityId, updates, authToken, currentUser.id)
      setAvailability(prev =>
        prev.map(a =>
          a.id === availabilityId ? updated : a
        )
      )
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const handleUpdateUser = async (user: User) => {
    const nextUser = { ...user, auth_id: user.auth_id ?? user.id }
    setCurrentUser(nextUser)
    if (!authToken) return
    const updated = await api.updateProfile({
      name: user.name,
      faculty: user.faculty ?? null,
      institution_code: user.institutionCode ?? null,
    }, authToken, currentUser.id)
    if (updated) {
      saveSession(authToken, nextUser)
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ...nextUser } : u)))
    }
  }

  const handleUpdateAppointment = async (appointment: Appointment) => {
    setAppointments(prev => prev.map(a => (a.id === appointment.id ? { ...a, ...appointment } : a)))

    if (!authToken) return

    try {
      const updated = await api.updateAppointment(appointment, authToken, currentUser.id)
      setAppointments(prev => prev.map(a => (a.id === appointment.id ? updated : a)))
    } catch (error) {
      console.error('Error updating appointment on server:', error)
    }
  }

  const screenContext = {
    currentUser,
    currentPage,
    appointments,
    moodLogs,
    resources,
    sessionNotes,
    users,
    availability,
    onNavigate: handleNavigate,
    onFeedback: () => {}, // No more alerts
    onAddAppointment: handleAddAppointment,
    onAddMoodLog: handleAddMoodLog,
    onAddResource: handleAddResource,
    onAddSessionNote: handleAddSessionNote,
    onUpdateAppointment: handleUpdateAppointment,
    onAddAvailability: handleAddAvailability,
    onDeleteAvailability: handleDeleteAvailability,
    onUpdateAvailability: handleUpdateAvailability,
    onUpdateUser: handleUpdateUser,
  }

  if (view === 'landing') {
    return <LandingPage onOpenLogin={() => openAuth('login')} onOpenRegister={() => openAuth('register')} />
  }

  if (view === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        initialRole={currentRole}
        authError={authError}
        onSubmit={handleAuthSubmit}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        onBack={() => setView('landing')}
      />
    )
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        items={items}
        activePage={currentPage}
        currentRoleName={currentRoleName}
        onNavigate={handleNavigate}
      />

      <div className={styles.main}>
        <TopBar
          title={currentPage === `${currentRole}-dashboard` ? 'Dashboard' : ''}
          userName={currentUser.name}
          userSubtitle={`${currentUser.institutionCode || currentUser.id} • ${currentRoleName}`}
          onShowHelpline={() => alert('🚨 NAMIBIAN CRISIS HELPLINES\nLifeline Namibia: 061 222 222\nMental Health Helpline: 0800 000 111')}
        />

        <main className={styles.content}>
          <ScreenRenderer
            context={screenContext}
          />
        </main>
      </div>
    </div>
  )
}

export default App
