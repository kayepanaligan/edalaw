import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
export const showPending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPending.url(options),
    method: 'get',
})

showPending.definition = {
    methods: ["get","head"],
    url: '/account-pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
showPending.url = (options?: RouteQueryOptions) => {
    return showPending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
showPending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
showPending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPending.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
export const showRejected = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRejected.url(options),
    method: 'get',
})

showRejected.definition = {
    methods: ["get","head"],
    url: '/account-rejected',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
showRejected.url = (options?: RouteQueryOptions) => {
    return showRejected.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
showRejected.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRejected.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\AccountStatusController::showRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
showRejected.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRejected.url(options),
    method: 'head',
})
const AccountStatusController = { showPending, showRejected }

export default AccountStatusController