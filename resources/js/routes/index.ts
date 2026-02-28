import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:9
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:9
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:9
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:9
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
export const accountPending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accountPending.url(options),
    method: 'get',
})

accountPending.definition = {
    methods: ["get","head"],
    url: '/account-pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
accountPending.url = (options?: RouteQueryOptions) => {
    return accountPending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
accountPending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accountPending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountPending
 * @see app/Http/Controllers/Auth/AccountStatusController.php:16
 * @route '/account-pending'
 */
accountPending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accountPending.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
export const accountRejected = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accountRejected.url(options),
    method: 'get',
})

accountRejected.definition = {
    methods: ["get","head"],
    url: '/account-rejected',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
accountRejected.url = (options?: RouteQueryOptions) => {
    return accountRejected.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
accountRejected.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accountRejected.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\AccountStatusController::accountRejected
 * @see app/Http/Controllers/Auth/AccountStatusController.php:36
 * @route '/account-rejected'
 */
accountRejected.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accountRejected.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:82
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:82
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:82
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:82
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})