import AccountAppealReviewController from './AccountAppealReviewController'
import AppealsOversightController from './AppealsOversightController'
import AuditLogController from './AuditLogController'
import EburolManagementController from './EburolManagementController'
import IncidentReportingController from './IncidentReportingController'
import InmateTunnelController from './InmateTunnelController'
import NotificationManagementController from './NotificationManagementController'
import ScheduleManagementController from './ScheduleManagementController'
import SessionManagementController from './SessionManagementController'
import SuggestionManagementController from './SuggestionManagementController'
import TimeSlotConfigurationController from './TimeSlotConfigurationController'
import UserManagementController from './UserManagementController'
const Admin = {
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
ScheduleManagementController: Object.assign(ScheduleManagementController, ScheduleManagementController),
EburolManagementController: Object.assign(EburolManagementController, EburolManagementController),
TimeSlotConfigurationController: Object.assign(TimeSlotConfigurationController, TimeSlotConfigurationController),
AppealsOversightController: Object.assign(AppealsOversightController, AppealsOversightController),
AccountAppealReviewController: Object.assign(AccountAppealReviewController, AccountAppealReviewController),
SuggestionManagementController: Object.assign(SuggestionManagementController, SuggestionManagementController),
NotificationManagementController: Object.assign(NotificationManagementController, NotificationManagementController),
SessionManagementController: Object.assign(SessionManagementController, SessionManagementController),
AuditLogController: Object.assign(AuditLogController, AuditLogController),
IncidentReportingController: Object.assign(IncidentReportingController, IncidentReportingController),
InmateTunnelController: Object.assign(InmateTunnelController, InmateTunnelController),
}

export default Admin