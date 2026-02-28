import OtpVerificationController from './OtpVerificationController'
import AccountStatusController from './AccountStatusController'
import AccountAppealController from './AccountAppealController'
const Auth = {
    OtpVerificationController: Object.assign(OtpVerificationController, OtpVerificationController),
AccountStatusController: Object.assign(AccountStatusController, AccountStatusController),
AccountAppealController: Object.assign(AccountAppealController, AccountAppealController),
}

export default Auth