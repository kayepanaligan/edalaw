import appeals from './appeals'
import callLogs from './call-logs'
import eburol from './eburol'
import history from './history'
import notifications from './notifications'
import schedule from './schedule'
import schedules from './schedules'
import sessions from './sessions'
import suggestions from './suggestions'
const visitor = {
    schedules: Object.assign(schedules, schedules),
schedule: Object.assign(schedule, schedule),
callLogs: Object.assign(callLogs, callLogs),
eburol: Object.assign(eburol, eburol),
notifications: Object.assign(notifications, notifications),
sessions: Object.assign(sessions, sessions),
appeals: Object.assign(appeals, appeals),
suggestions: Object.assign(suggestions, suggestions),
history: Object.assign(history, history),
}

export default visitor