import VisitorDashboardController from './VisitorDashboardController'
import SuperAdminDashboardController from './SuperAdminDashboardController'
import BjmpOfficerDashboardController from './BjmpOfficerDashboardController'
import MonitoringOfficerDashboardController from './MonitoringOfficerDashboardController'
const Dashboard = {
    VisitorDashboardController: Object.assign(VisitorDashboardController, VisitorDashboardController),
SuperAdminDashboardController: Object.assign(SuperAdminDashboardController, SuperAdminDashboardController),
BjmpOfficerDashboardController: Object.assign(BjmpOfficerDashboardController, BjmpOfficerDashboardController),
MonitoringOfficerDashboardController: Object.assign(MonitoringOfficerDashboardController, MonitoringOfficerDashboardController),
}

export default Dashboard