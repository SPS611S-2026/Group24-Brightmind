# Mental Health Support Portal - Complete Data Flow Documentation

## 🔄 END-TO-END DATA FLOWS

### 1. STUDENT BOOKING APPOINTMENTS FLOW

#### Flow Steps:
1. **Student logs in** → Redirected to Student Dashboard
2. **Student navigates to Appointments** → Enters `appointments` page
3. **View available counsellors** → System fetches:
   - All counsellors with role='counsellor'
   - Their availability slots from database

4. **Student selects time slot**:
   - Picks a counsellor
   - Picks an availability slot (date + startTime/endTime)
   - Adds reason for appointment (optional)

5. **Student confirms booking**:
   - Frontend calls `context.onAddAppointment()`
   - This calls backend API: `POST /api/appointments`
   - Backend creates appointment record in database
   - Returns appointment object with ID

6. **Appointment visible in calendar**:
   - Dashboard shows booked appointment counter
   - Calendar marks that date as "booked" (blue)
   - Student can see in "Your Appointments" section

#### Data Structure Created:
```json
{
  "id": "appt_timestamp_random",
  "student_id": "224016393",
  "counsellor_id": "C-001",
  "date": "2025-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "reason": "Stress management",
  "status": "confirmed",
  "urgent": false,
  "flagged_by": null,
  "created_at": "2025-04-13T10:30:00Z"
}
```

---

### 2. STUDENT FLAGGING APPOINTMENTS AS URGENT

#### Flow Steps:
1. **Student views their appointments** → Section "Your Appointments"
2. **Student sees "Flag 🚨" button** on each appointment
3. **Student clicks "Flag 🚨"** → Turns appointment urgent
   - Frontend calls `context.onUpdateAppointment()`
   - Updates appointment with `urgent: true` and `flagged_by: student_id`
   - Backend API: `PUT /api/appointments/{id}`
   - Appointment marked as urgent in database

4. **Urgent appointment displays with red border** and "🚨 URGENT" label
5. **Change is immediate** in the UI

#### Updated Appointment:
```json
{
  "id": "appt_timestamp_random",
  "student_id": "224016393",
  "counsellor_id": "C-001",
  "date": "2025-04-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "reason": "Stress management",
  "status": "confirmed",
  "urgent": true,              // ← NOW TRUE
  "flagged_by": "224016393",   // ← STUDENT ID
  "created_at": "2025-04-13T10:30:00Z"
}
```

---

### 3. COUNSELLOR SETTING AVAILABILITY

#### Flow Steps:
1. **Counsellor logs in** → Redirected to Counsellor Dashboard
2. **Counsellor navigates to Set Availability**
3. **Counsellor fills form**:
   - Date: `2025-04-21`
   - Start Time: `09:00`
   - End Time: `10:00`

4. **Counsellor clicks "Add Availability Slot"**:
   - Frontend calls `context.onAddAvailability()`
   - Sends to backend: `POST /api/availability`
   - Backend creates availability record with `counsellor_id`

5. **Slot immediately added to list** in UI
6. **Calendar updates** → Shows green "Free" slot in calendar
7. **Students can see this slot** in Appointments page under that counsellor

#### Data Structure Created:
```json
{
  "id": "avail_12345",
  "counsellor_id": "C-001",
  "date": "2025-04-21",
  "startTime": "09:00",
  "endTime": "10:00",
  "created_at": "2025-04-13T10:45:00Z"
}
```

---

### 4. COUNSELLOR VIEWING URGENT APPOINTMENTS

#### Flow Steps:
1. **Counsellor navigates to Urgent Flags page**
2. **System loads**:
   - All appointments for counsellor with `urgent: true`
   - All students with mood logs containing "Bad"

3. **Urgent Appointments Section** shows:
   - Total count of urgent flagged appointments
   - List with student name, date, time, reason
   - Red alert indicators
   - Who flagged it (student or counsellor)

4. **Students with Bad Mood Section** shows:
   - Count of students with bad mood logs
   - Their sleep, energy, stress levels

#### Example Display:
```
🚨 Urgent Appointments (2)
[Flagged Appointment 1]
  👤 John Mwanawasa
  📅 2025-04-20 at 14:00
  💬 Reason: Severe anxiety
  Flagged by: Student

[Flagged Appointment 2]
  👤 Sarah Ndlela
  📅 2025-04-22 at 11:00
  💬 Reason: Suicidal thoughts
  Flagged by: Student
```

---

### 5. COUNSELLOR VIEWING APPOINTMENTS CALENDAR

#### Flow Steps:
1. **Counsellor Dashboard** shows:
   - Today's appointments count
   - This week's appointments count
   - Urgent flags count
   - Students supported count

2. **Calendar visualization**:
   - GREEN slots = Available (free) time slots
   - BLUE slots = Booked appointments
   - Shows count of each type per day
   - Can navigate months with arrow buttons

3. **Counsellor can see in "Appointment Calendar" page**:
   - All their booked appointments
   - Student details
   - Appointment reason
   - Status and urgent flags

---

## 📊 API ENDPOINTS REFERENCE

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment (including urgent flag)

### Availability
- `GET /api/availability` - Get all availability slots
- `POST /api/availability` - Create availability slot
- `PUT /api/availability/{id}` - Update availability slot
- `DELETE /api/availability/{id}` - Delete availability slot

### Mood Logs
- `GET /api/mood_logs` - Get all mood logs
- `POST /api/mood_logs` - Create mood log entry

### Session Notes
- `GET /api/session_notes` - Get session notes
- `POST /api/session_notes` - Create session note

---

## 🗄️ DATABASE SCHEMA

### Appointment
```sql
CREATE TABLE Appointment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(255),
  counsellor_id VARCHAR(255),
  availability_id VARCHAR(255),
  date DATE,
  startTime TIME,
  endTime TIME,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  urgent BOOLEAN DEFAULT false,
  flagged_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Availability
```sql
CREATE TABLE Availability (
  id INT PRIMARY KEY AUTO_INCREMENT,
  counsellor_id VARCHAR(255),
  date DATE,
  startTime TIME,
  endTime TIME,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### MoodLog
```sql
CREATE TABLE MoodLog (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(255),
  date DATE,
  mood VARCHAR(50),
  sleep VARCHAR(100),
  appetite VARCHAR(100),
  energy VARCHAR(100),
  stress VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## ✅ TESTING CHECKLIST

### Student Workflow
- [ ] Student can login
- [ ] Student sees available counsellors
- [ ] Student can book an available appointment
- [ ] Booked appointment shows in "Your Appointments"
- [ ] Student can flag appointment as urgent
- [ ] Urgent flag turns appointment red with 🚨 icon
- [ ] Calendar shows appointment as "Booked" (blue)

### Counsellor Workflow
- [ ] Counsellor can login
- [ ] Counsellor can add availability slots
- [ ] Added slots show in availability list
- [ ] Calendar shows slots as "Free" (green)
- [ ] Counsellor can see bookings on calendar
- [ ] Counsellor can see urgent flagged appointments
- [ ] Urgent section shows at top of Appointment Calendar page
- [ ] Dashboard updates urgent flag count

### Data Persistence
- [ ] Data persists after page refresh
- [ ] Multiple appointments can be created
- [ ] Multiple availability slots can be created
- [ ] Urgent flag updates in real-time
- [ ] Calendar displays all changes immediately

---

## 🔧 DEBUGGING TIPS

### Check Frontend Console
```javascript
// Set availability logging
console.log('Current availability:', context.availability)
console.log('My availability (filtered):', context.availability.filter(a => a.counsellor_id === context.currentUser.id))
```

### Check Backend Logs
- Look for ✅ messages indicating successful DB operations
- Look for 📦 messages indicating fallback to mock storage
- Check `/api/availability` endpoint returns counsellor slots

### Common Issues
1. **Availability not showing**: Check counsellor_id matches currentUser.id
2. **Bookings not appearing**: Check student_id in appointment matches logged-in user
3. **Calendar blank**: Verify availability data is being loaded in App.tsx
4. **Urgent flag not updating**: Check onUpdateAppointment is called with urgent property

