import EburolManagementController from './EburolManagementController'
import ScheduleManagementController from './ScheduleManagementController'
import AppealReviewController from './AppealReviewController'
import AuditLogController from './AuditLogController'
const BjmpOfficer = {
    EburolManagementController: Object.assign(EburolManagementController, EburolManagementController),
ScheduleManagementController: Object.assign(ScheduleManagementController, ScheduleManagementController),
AppealReviewController: Object.assign(AppealReviewController, AppealReviewController),
AuditLogController: Object.assign(AuditLogController, AuditLogController),
}

export default BjmpOfficer