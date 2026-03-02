import AnalyticsController from './AnalyticsController'
import VideoRecordingsController from './VideoRecordingsController'
import ChatRecordingsController from './ChatRecordingsController'
import VisitMonitoringController from './VisitMonitoringController'
import EburolMonitoringController from './EburolMonitoringController'
import AssignedSessionsController from './AssignedSessionsController'
import IncidentReportingController from './IncidentReportingController'
import HistoryController from './HistoryController'
import InmateTunnelController from './InmateTunnelController'
import NotificationController from './NotificationController'
const MonitoringOfficer = {
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
VideoRecordingsController: Object.assign(VideoRecordingsController, VideoRecordingsController),
ChatRecordingsController: Object.assign(ChatRecordingsController, ChatRecordingsController),
VisitMonitoringController: Object.assign(VisitMonitoringController, VisitMonitoringController),
EburolMonitoringController: Object.assign(EburolMonitoringController, EburolMonitoringController),
AssignedSessionsController: Object.assign(AssignedSessionsController, AssignedSessionsController),
IncidentReportingController: Object.assign(IncidentReportingController, IncidentReportingController),
HistoryController: Object.assign(HistoryController, HistoryController),
InmateTunnelController: Object.assign(InmateTunnelController, InmateTunnelController),
NotificationController: Object.assign(NotificationController, NotificationController),
}

export default MonitoringOfficer