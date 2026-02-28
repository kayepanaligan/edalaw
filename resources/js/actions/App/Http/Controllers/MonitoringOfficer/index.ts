import VisitMonitoringController from './VisitMonitoringController'
import EburolMonitoringController from './EburolMonitoringController'
import AssignedSessionsController from './AssignedSessionsController'
const MonitoringOfficer = {
    VisitMonitoringController: Object.assign(VisitMonitoringController, VisitMonitoringController),
EburolMonitoringController: Object.assign(EburolMonitoringController, EburolMonitoringController),
AssignedSessionsController: Object.assign(AssignedSessionsController, AssignedSessionsController),
}

export default MonitoringOfficer