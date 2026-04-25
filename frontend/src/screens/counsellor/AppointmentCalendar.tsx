import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function AppointmentCalendar({ context }: { context: ScreenContext }) {
  const myAppointments = context.appointments.filter(a => a.counsellor_id === context.currentUser.id)
  const urgentAppointments = myAppointments.filter(a => a.urgent && a.status === 'confirmed')
  const confirmedAppointments = myAppointments.filter(a => a.status === 'confirmed')
  const cancelledAppointments = myAppointments.filter(a => a.status === 'cancelled')

  const getStudentName = (id: string) => context.users.find(u => u.id === id)?.name || id

  const avatarColors = ['#1e3a8a', '#0f766e', '#92400e', '#7c2d12', '#374151', '#4338ca']

  const getAvatarColor = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  const handleCancelAppointment = (appointment: typeof confirmedAppointments[number]) => {
    if (!confirm('Cancel this appointment? Students will see this slot as available again.')) return

    const cancellationReason = appointment.reason
      ? `${appointment.reason} (Cancelled by counsellor)`
      : 'Cancelled by counsellor'

    context.onUpdateAppointment({
      ...appointment,
      status: 'cancelled',
      reason: cancellationReason,
      urgent: false,
    })
  }

  return (
    <div>
      {urgentAppointments.length > 0 && (
        <div className={styles.card} style={{ marginBottom: '2rem', borderColor: '#ff6b6b', borderWidth: '2px' }}>
          <h3 className={styles.cardHeading} style={{ color: '#ff6b6b' }}>
            🚨 Urgent Appointments ({urgentAppointments.length})
          </h3>
          <div className={styles.list}>
            {urgentAppointments.map(appointment => (
              <div key={appointment.id} className={styles.listItem} style={{ borderColor: '#ff6b6b', backgroundColor: '#ffe6e6' }}>
                <div>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getAvatarColor(getStudentName(appointment.student_id)),
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(getStudentName(appointment.student_id))}
                    </span>
                    {getStudentName(appointment.student_id)}
                  </strong>
                  <p>📅 {appointment.date} at {appointment.startTime}</p>
                  <p style={{ color: '#ff6b6b', fontWeight: '600' }}>Reason: {appointment.reason || 'Not specified'}</p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Flagged by: {appointment.flagged_by === appointment.student_id ? 'Student' : 'Counsellor'}</p>
                </div>
                <span style={{ color: '#ff6b6b', fontWeight: '700', fontSize: '1.5rem' }}>!</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h3 className={styles.cardHeading}>📅 My Appointments</h3>
        <p className={styles.sectionCopy}>Total: {confirmedAppointments.length} | Urgent: {urgentAppointments.length}</p>
        <div className={styles.list}>
          {confirmedAppointments.length === 0 ? (
            <p className={styles.cardText}>No confirmed appointments scheduled</p>
          ) : (
            confirmedAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={styles.listItem}
                style={{
                  borderLeft: appointment.urgent ? '4px solid #ff6b6b' : '4px solid #1e3a8a',
                  backgroundColor: appointment.urgent ? '#ffe6e6' : '#f8fafc',
                }}
              >
                <div>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getAvatarColor(getStudentName(appointment.student_id)),
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(getStudentName(appointment.student_id))}
                    </span>
                    {getStudentName(appointment.student_id)}
                    {appointment.urgent && <span style={{ color: '#ff6b6b', marginLeft: '0.5rem' }}>🚨 URGENT</span>}
                  </strong>
                  <p>📅 {appointment.date} | 🕐 {appointment.startTime} - {appointment.endTime}</p>
                  {appointment.reason && <p>💭 Reason: {appointment.reason}</p>}
                  <p style={{ fontSize: '0.8rem', color: '#999' }}>ID: {appointment.id}</p>
                </div>
                {appointment.status === 'confirmed' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => context.onNavigate(`session-notes?appointment=${appointment.id}`)}
                      className={styles.button}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginTop: 0 }}
                    >
                      Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelAppointment(appointment)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        borderRadius: '999px',
                        border: 'none',
                        background: '#ef4444',
                        color: 'white',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <h3 className={styles.cardHeading}>🗂️ Cancelled Appointments</h3>
        {cancelledAppointments.length === 0 ? (
          <p className={styles.cardText}>No cancelled appointments.</p>
        ) : (
          <div className={styles.list}>
            {cancelledAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={styles.listItem}
                style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}
              >
                <div>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getAvatarColor(getStudentName(appointment.student_id)),
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(getStudentName(appointment.student_id))}
                    </span>
                    {getStudentName(appointment.student_id)}
                  </strong>
                  <p>📅 {appointment.date} | 🕐 {appointment.startTime} - {appointment.endTime}</p>
                  {appointment.reason && <p style={{ color: '#991b1b' }}>💭 {appointment.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
