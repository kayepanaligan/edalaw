import AccountAppealController from './AccountAppealController'
import AccountStatusController from './AccountStatusController'
import OtpVerificationController from './OtpVerificationController'
import PasswordResetOtpController from './PasswordResetOtpController'
const Auth = {
    OtpVerificationController: Object.assign(OtpVerificationController, OtpVerificationController),
PasswordResetOtpController: Object.assign(PasswordResetOtpController, PasswordResetOtpController),
AccountStatusController: Object.assign(AccountStatusController, AccountStatusController),
AccountAppealController: Object.assign(AccountAppealController, AccountAppealController),
}

export default Auth