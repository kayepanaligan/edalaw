import AppealReviewController from './AppealReviewController'
import AuditLogController from './AuditLogController'
import CellManagementController from './CellManagementController'
import CellScheduleTemplateController from './CellScheduleTemplateController'
import EburolManagementController from './EburolManagementController'
import InmateManagementController from './InmateManagementController'
import NotificationController from './NotificationController'
import ScheduleManagementController from './ScheduleManagementController'
const BjmpOfficer = {
    NotificationController: Object.assign(NotificationController, NotificationController),
EburolManagementController: Object.assign(EburolManagementController, EburolManagementController),
ScheduleManagementController: Object.assign(ScheduleManagementController, ScheduleManagementController),
AppealReviewController: Object.assign(AppealReviewController, AppealReviewController),
AuditLogController: Object.assign(AuditLogController, AuditLogController),
CellManagementController: Object.assign(CellManagementController, CellManagementController),
InmateManagementController: Object.assign(InmateManagementController, InmateManagementController),
CellScheduleTemplateController: Object.assign(CellScheduleTemplateController, CellScheduleTemplateController),
}

export default BjmpOfficer