import PasswordController from './PasswordController'
import ProfileController from './ProfileController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Settings