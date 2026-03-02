import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/password/reset',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::show
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:116
 * @route '/password/reset'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::submit
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:128
 * @route '/password/reset'
 */
export const submit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/password/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::submit
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:128
 * @route '/password/reset'
 */
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordResetOtpController::submit
 * @see app/Http/Controllers/Auth/PasswordResetOtpController.php:128
 * @route '/password/reset'
 */
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})
const reset = {
    show: Object.assign(show, show),
submit: Object.assign(submit, submit),
}

export default reset