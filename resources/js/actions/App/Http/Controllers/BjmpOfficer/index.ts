import NotificationController from './NotificationController'
import EburolManagementController from './EburolManagementController'
import ScheduleManagementController from './ScheduleManagementController'
import AppealReviewController from './AppealReviewController'
import AuditLogController from './AuditLogController'
import CellManagementController from './CellManagementController'
import InmateManagementController from './InmateManagementController'
import CellScheduleTemplateController from './CellScheduleTemplateController'
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