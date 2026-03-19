import Admin from './Admin'
import Auth from './Auth'
import BjmpOfficer from './BjmpOfficer'
import Dashboard from './Dashboard'
import InmateTunnelController from './InmateTunnelController'
import MonitoringOfficer from './MonitoringOfficer'
import Settings from './Settings'
import StaffVisitSessionJoinController from './StaffVisitSessionJoinController'
import VideoRoomController from './VideoRoomController'
import Visitor from './Visitor'
import VisitProofController from './VisitProofController'
import VisitSessionChatController from './VisitSessionChatController'
import VisitSessionChatExportController from './VisitSessionChatExportController'
import Webhook from './Webhook'
const Controllers = {
    Webhook: Object.assign(Webhook, Webhook),
InmateTunnelController: Object.assign(InmateTunnelController, InmateTunnelController),
VideoRoomController: Object.assign(VideoRoomController, VideoRoomController),
Auth: Object.assign(Auth, Auth),
Dashboard: Object.assign(Dashboard, Dashboard),
MonitoringOfficer: Object.assign(MonitoringOfficer, MonitoringOfficer),
VisitSessionChatController: Object.assign(VisitSessionChatController, VisitSessionChatController),
VisitSessionChatExportController: Object.assign(VisitSessionChatExportController, VisitSessionChatExportController),
VisitProofController: Object.assign(VisitProofController, VisitProofController),
Admin: Object.assign(Admin, Admin),
StaffVisitSessionJoinController: Object.assign(StaffVisitSessionJoinController, StaffVisitSessionJoinController),
Visitor: Object.assign(Visitor, Visitor),
BjmpOfficer: Object.assign(BjmpOfficer, BjmpOfficer),
Settings: Object.assign(Settings, Settings),
}

export default Controllers