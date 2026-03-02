import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/password/verify-otp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:72
 * @route '/password/verify-otp'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::submit
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:84
 * @route '/password/verify-otp'
 */
export const submit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/password/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::submit
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:84
 * @route '/password/verify-otp'
 */
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::submit
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:84
 * @route '/password/verify-otp'
 */
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})
const verifyOtp = {
    show: Object.assign(show, show),
submit: Object.assign(submit, submit),
}

export default verifyOtp