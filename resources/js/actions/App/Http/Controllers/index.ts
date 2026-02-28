import Webhook from './Webhook'
import InmateTunnelController from './InmateTunnelController'
import Auth from './Auth'
import Dashboard from './Dashboard'
import MonitoringOfficer from './MonitoringOfficer'
import VisitProofController from './VisitProofController'
import Admin from './Admin'
import Visitor from './Visitor'
import BjmpOfficer from './BjmpOfficer'
import Settings from './Settings'
const Controllers = {
    Webhook: Object.assign(Webhook, Webhook),
InmateTunnelController: Object.assign(InmateTunnelController, InmateTunnelController),
Auth: Object.assign(Auth, Auth),
Dashboard: Object.assign(Dashboard, Dashboard),
MonitoringOfficer: Object.assign(MonitoringOfficer, MonitoringOfficer),
VisitProofController: Object.assign(VisitProofController, VisitProofController),
Admin: Object.assign(Admin, Admin),
Visitor: Object.assign(Visitor, Visitor),
BjmpOfficer: Object.assign(BjmpOfficer, BjmpOfficer),
Settings: Object.assign(Settings, Settings),
}

export default Controllers