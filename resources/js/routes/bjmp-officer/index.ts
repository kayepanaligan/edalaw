import notifications from './notifications'
import eburols from './eburols'
import schedules from './schedules'
import visitSession from './visit-session'
import appeals from './appeals'
import auditLogs from './audit-logs'
import cells from './cells'
import inmates from './inmates'
import cellSchedules from './cell-schedules'
const bjmpOfficer = {
    notifications: Object.assign(notifications, notifications),
eburols: Object.assign(eburols, eburols),
schedules: Object.assign(schedules, schedules),
visitSession: Object.assign(visitSession, visitSession),
appeals: Object.assign(appeals, appeals),
auditLogs: Object.assign(auditLogs, auditLogs),
cells: Object.assign(cells, cells),
inmates: Object.assign(inmates, inmates),
cellSchedules: Object.assign(cellSchedules, cellSchedules),
}

export default bjmpOfficer