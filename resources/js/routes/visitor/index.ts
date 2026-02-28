import schedules from './schedules'
import schedule from './schedule'
import callLogs from './call-logs'
import eburol from './eburol'
import notifications from './notifications'
import sessions from './sessions'
import appeals from './appeals'
import suggestions from './suggestions'
import history from './history'
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