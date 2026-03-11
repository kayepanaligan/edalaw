import accountAppeals from './account-appeals'
import appeals from './appeals'
import auditLogs from './audit-logs'
import eburols from './eburols'
import incidentReporting from './incident-reporting'
import inmateTunnels from './inmate-tunnels'
import notifications from './notifications'
import schedules from './schedules'
import sessions from './sessions'
import suggestions from './suggestions'
import timeSlotCapacities from './time-slot-capacities'
import users from './users'
import visitSession from './visit-session'
const admin = {
    users: Object.assign(users, users),
schedules: Object.assign(schedules, schedules),
visitSession: Object.assign(visitSession, visitSession),
eburols: Object.assign(eburols, eburols),
timeSlotCapacities: Object.assign(timeSlotCapacities, timeSlotCapacities),
appeals: Object.assign(appeals, appeals),
accountAppeals: Object.assign(accountAppeals, accountAppeals),
suggestions: Object.assign(suggestions, suggestions),
notifications: Object.assign(notifications, notifications),
sessions: Object.assign(sessions, sessions),
auditLogs: Object.assign(auditLogs, auditLogs),
incidentReporting: Object.assign(incidentReporting, incidentReporting),
inmateTunnels: Object.assign(inmateTunnels, inmateTunnels),
}

export default admin