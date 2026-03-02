import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/password/forgot',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:25
 * @route '/password/forgot'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::send
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:35
 * @route '/password/forgot'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/password/forgot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::send
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:35
 * @route '/password/forgot'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::send
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:35
 * @route '/password/forgot'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})
const forgot = {
    show: Object.assign(show, show),
send: Object.assign(send, send),
}

export default forgot