import VisitorDashboardController from './VisitorDashboardController'
import SuperAdminDashboardController from './SuperAdminDashboardController'
import BjmpOfficerDashboardController from './BjmpOfficerDashboardController'
const Dashboard = {
    VisitorDashboardController: Object.assign(VisitorDashboardController, VisitorDashboardController),
SuperAdminDashboardController: Object.assign(SuperAdminDashboardController, SuperAdminDashboardController),
BjmpOfficerDashboardController: Object.assign(BjmpOfficerDashboardController, BjmpOfficerDashboardController),
}

export default Dashboard