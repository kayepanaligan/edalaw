import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showForgotForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
export const showForgotForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showForgotForm.url(options),
    method: 'get',
})

showForgotForm.definition = {
    methods: ["get","head"],
    url: '/password/forgot',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showForgotForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
showForgotForm.url = (options?: RouteQueryOptions) => {
    return showForgotForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showForgotForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
showForgotForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showForgotForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showForgotForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
showForgotForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showForgotForm.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::sendOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:35
 * @route '/password/forgot'
 */
export const sendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

sendOtp.definition = {
    methods: ["post"],
    url: '/password/forgot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::sendOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:35
 * @route '/password/forgot'
 */
sendOtp.url = (options?: RouteQueryOptions) => {
    return sendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::sendOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:35
 * @route '/password/forgot'
 */
sendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showVerifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
export const showVerifyOtp = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVerifyOtp.url(options),
    method: 'get',
})

showVerifyOtp.definition = {
    methods: ["get","head"],
    url: '/password/verify-otp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showVerifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
showVerifyOtp.url = (options?: RouteQueryOptions) => {
    return showVerifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showVerifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
showVerifyOtp.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVerifyOtp.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showVerifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
showVerifyOtp.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVerifyOtp.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:84
 * @route '/password/verify-otp'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/password/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:84
 * @route '/password/verify-otp'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::verifyOtp
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:84
 * @route '/password/verify-otp'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showResetForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
export const showResetForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showResetForm.url(options),
    method: 'get',
})

showResetForm.definition = {
    methods: ["get","head"],
    url: '/password/reset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showResetForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
showResetForm.url = (options?: RouteQueryOptions) => {
    return showResetForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showResetForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
showResetForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showResetForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::showResetForm
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
showResetForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showResetForm.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::reset
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:128
 * @route '/password/reset'
 */
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/password/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::reset
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:128
 * @route '/password/reset'
 */
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::reset
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:128
 * @route '/password/reset'
 */
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})
const PasswordResetOtpController = { showForgotForm, sendOtp, showVerifyOtp, verifyOtp, showResetForm, reset }

export default PasswordResetOtpController