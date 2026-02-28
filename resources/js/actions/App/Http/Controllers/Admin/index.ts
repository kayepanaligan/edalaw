import UserManagementController from './UserManagementController'
import ScheduleManagementController from './ScheduleManagementController'
import EburolManagementController from './EburolManagementController'
import TimeSlotConfigurationController from './TimeSlotConfigurationController'
import AppealsOversightController from './AppealsOversightController'
import AccountAppealReviewController from './AccountAppealReviewController'
import SuggestionManagementController from './SuggestionManagementController'
import NotificationManagementController from './NotificationManagementController'
import SessionManagementController from './SessionManagementController'
import AuditLogController from './AuditLogController'
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
}

export default Admin