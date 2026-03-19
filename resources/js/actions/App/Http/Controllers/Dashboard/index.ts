import BjmpOfficerDashboardController from './BjmpOfficerDashboardController'
import SuperAdminDashboardController from './SuperAdminDashboardController'
import VisitorDashboardController from './VisitorDashboardController'
const Dashboard = {
    VisitorDashboardController: Object.assign(VisitorDashboardController, VisitorDashboardController),
SuperAdminDashboardController: Object.assign(SuperAdminDashboardController, SuperAdminDashboardController),
BjmpOfficerDashboardController: Object.assign(BjmpOfficerDashboardController, BjmpOfficerDashboardController),
}

export default Dashboard