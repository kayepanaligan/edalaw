import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::show
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:20
 * @route '/otp-verification'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/otp-verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::show
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:20
 * @route '/otp-verification'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::show
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:20
 * @route '/otp-verification'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::show
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:20
 * @route '/otp-verification'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::verify
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:45
 * @route '/otp-verification/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/otp-verification/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::verify
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:45
 * @route '/otp-verification/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::verify
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:45
 * @route '/otp-verification/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::resend
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:91
 * @route '/otp-verification/resend'
 */
export const resend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/otp-verification/resend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::resend
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:91
 * @route '/otp-verification/resend'
 */
resend.url = (options?: RouteQueryOptions) => {
    return resend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\OtpVerificationController::resend
 * @see app/Http/Controllers/Auth/OtpVerificationController.php:91
 * @route '/otp-verification/resend'
 */
resend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})
const OtpVerificationController = { show, verify, resend }

export default OtpVerificationController