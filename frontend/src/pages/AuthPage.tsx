import { useState, type FormEvent } from 'react'
import styles from '../styles/AuthPage.module.css'
import type { Role } from '../types'

type AuthFormData = {
  mode: 'login' | 'register'
  name: string
  email: string
  password: string
  role: Role
  institutionCode: string
}

type AuthPageProps = {
  mode: 'login' | 'register'
  initialRole: Role
  authError?: string | null
  onSubmit(data: AuthFormData): void
  onSwitchMode(): void
  onBack(): void
}

export default function AuthPage({ mode, initialRole, authError, onSubmit, onSwitchMode, onBack }: AuthPageProps) {
  const [role, setRole] = useState<Role>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institutionCode, setInstitutionCode] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      mode,
      name: name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      email,
      password,
      role,
      institutionCode,
    })
  }

  const institutionLabel = role === 'student'
    ? 'Student Card Number'
    : role === 'counsellor'
      ? 'Counsellor Code'
      : 'Admin Code'

  return (
    <div className={styles.container}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Back to landing
      </button>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p>{mode === 'login' ? 'Login to your NUST Mental Health account.' : 'Register to access student, counsellor, or admin features.'}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className={styles.field}>
              <span>Name</span>
              <input value={name} onChange={event => setName(event.target.value)} placeholder="Enter your full name" />
            </label>
          )}
          {authError && <div className={styles.error}>{authError}</div>}

          <label className={styles.field}>
            <span>Email</span>
            <input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="name@domain.com" required />
          </label>

          <label className={styles.field}>
            <span>Role</span>
            <select value={role} onChange={event => setRole(event.target.value as Role)}>
              <option value="student">Student</option>
              <option value="counsellor">Counsellor</option>
              <option value="admin">Administrator</option>
            </select>
          </label>

          {mode === 'register' && (
            <label className={styles.field}>
              <span>{institutionLabel}</span>
              <input
                value={institutionCode}
                onChange={event => setInstitutionCode(event.target.value)}
                placeholder={role === 'student' ? 'e.g. STU-1023' : role === 'counsellor' ? 'e.g. CNS-045' : 'e.g. ADM-01'}
                required={role === 'student' || role === 'counsellor'}
              />
            </label>
          )}

          <label className={styles.field}>
            <span>Password</span>
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" required />
          </label>

          <button type="submit" className={styles.submitButton}>
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <button type="button" className={styles.switchMode} onClick={onSwitchMode}>
          {mode === 'login' ? 'Create a new account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}
