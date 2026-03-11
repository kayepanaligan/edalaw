import AppealController from './AppealController'
import AuditLogController from './AuditLogController'
import CallLogController from './CallLogController'
import EburolController from './EburolController'
import NotificationController from './NotificationController'
import ScheduleController from './ScheduleController'
import SessionController from './SessionController'
import SuggestionController from './SuggestionController'
import VisitSessionController from './VisitSessionController'
const Visitor = {
    ScheduleController: Object.assign(ScheduleController, ScheduleController),
CallLogController: Object.assign(CallLogController, CallLogController),
EburolController: Object.assign(EburolController, EburolController),
NotificationController: Object.assign(NotificationController, NotificationController),
SessionController: Object.assign(SessionController, SessionController),
AppealController: Object.assign(AppealController, AppealController),
SuggestionController: Object.assign(SuggestionController, SuggestionController),
AuditLogController: Object.assign(AuditLogController, AuditLogController),
VisitSessionController: Object.assign(VisitSessionController, VisitSessionController),
}

export default Visitor