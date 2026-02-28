import users from './users'
import schedules from './schedules'
import eburols from './eburols'
import timeSlotCapacities from './time-slot-capacities'
import appeals from './appeals'
import accountAppeals from './account-appeals'
import suggestions from './suggestions'
import notifications from './notifications'
import sessions from './sessions'
import auditLogs from './audit-logs'
const admin = {
    users: Object.assign(users, users),
schedules: Object.assign(schedules, schedules),
eburols: Object.assign(eburols, eburols),
timeSlotCapacities: Object.assign(timeSlotCapacities, timeSlotCapacities),
appeals: Object.assign(appeals, appeals),
accountAppeals: Object.assign(accountAppeals, accountAppeals),
suggestions: Object.assign(suggestions, suggestions),
notifications: Object.assign(notifications, notifications),
sessions: Object.assign(sessions, sessions),
auditLogs: Object.assign(auditLogs, auditLogs),
}

export default admin