import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:17
 * @route '/admin/sessions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/sessions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:17
 * @route '/admin/sessions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:17
 * @route '/admin/sessions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:17
 * @route '/admin/sessions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revoke
 * @see app/Http/Controllers/Admin/SessionManagementController.php:64
 * @route '/admin/sessions/{session}'
 */
export const revoke = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

revoke.definition = {
    methods: ["delete"],
    url: '/admin/sessions/{session}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revoke
 * @see app/Http/Controllers/Admin/SessionManagementController.php:64
 * @route '/admin/sessions/{session}'
 */
revoke.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return revoke.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revoke
 * @see app/Http/Controllers/Admin/SessionManagementController.php:64
 * @route '/admin/sessions/{session}'
 */
revoke.delete = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeUserSessions
 * @see app/Http/Controllers/Admin/SessionManagementController.php:82
 * @route '/admin/sessions/user/{user}/revoke-all'
 */
export const revokeUserSessions = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeUserSessions.url(args, options),
    method: 'post',
})

revokeUserSessions.definition = {
    methods: ["post"],
    url: '/admin/sessions/user/{user}/revoke-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeUserSessions
 * @see app/Http/Controllers/Admin/SessionManagementController.php:82
 * @route '/admin/sessions/user/{user}/revoke-all'
 */
revokeUserSessions.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return revokeUserSessions.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeUserSessions
 * @see app/Http/Controllers/Admin/SessionManagementController.php:82
 * @route '/admin/sessions/user/{user}/revoke-all'
 */
revokeUserSessions.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeUserSessions.url(args, options),
    method: 'post',
})
const SessionManagementController = { index, revoke, revokeUserSessions }

export default SessionManagementController