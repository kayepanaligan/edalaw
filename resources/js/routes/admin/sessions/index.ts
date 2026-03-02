import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:18
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
 * @see app/Http/Controllers/Admin/SessionManagementController.php:18
 * @route '/admin/sessions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:18
 * @route '/admin/sessions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SessionManagementController::index
 * @see app/Http/Controllers/Admin/SessionManagementController.php:18
 * @route '/admin/sessions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revoke
 * @see app/Http/Controllers/Admin/SessionManagementController.php:71
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
 * @see app/Http/Controllers/Admin/SessionManagementController.php:71
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
 * @see app/Http/Controllers/Admin/SessionManagementController.php:71
 * @route '/admin/sessions/{session}'
 */
revoke.delete = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeUserAll
 * @see app/Http/Controllers/Admin/SessionManagementController.php:89
 * @route '/admin/sessions/user/{user}/revoke-all'
 */
export const revokeUserAll = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeUserAll.url(args, options),
    method: 'post',
})

revokeUserAll.definition = {
    methods: ["post"],
    url: '/admin/sessions/user/{user}/revoke-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeUserAll
 * @see app/Http/Controllers/Admin/SessionManagementController.php:89
 * @route '/admin/sessions/user/{user}/revoke-all'
 */
revokeUserAll.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return revokeUserAll.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeUserAll
 * @see app/Http/Controllers/Admin/SessionManagementController.php:89
 * @route '/admin/sessions/user/{user}/revoke-all'
 */
revokeUserAll.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeUserAll.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeMyOther
 * @see app/Http/Controllers/Admin/SessionManagementController.php:109
 * @route '/admin/sessions/revoke-my-other'
 */
export const revokeMyOther = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeMyOther.url(options),
    method: 'post',
})

revokeMyOther.definition = {
    methods: ["post"],
    url: '/admin/sessions/revoke-my-other',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeMyOther
 * @see app/Http/Controllers/Admin/SessionManagementController.php:109
 * @route '/admin/sessions/revoke-my-other'
 */
revokeMyOther.url = (options?: RouteQueryOptions) => {
    return revokeMyOther.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SessionManagementController::revokeMyOther
 * @see app/Http/Controllers/Admin/SessionManagementController.php:109
 * @route '/admin/sessions/revoke-my-other'
 */
revokeMyOther.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeMyOther.url(options),
    method: 'post',
})
const sessions = {
    index: Object.assign(index, index),
revoke: Object.assign(revoke, revoke),
revokeUserAll: Object.assign(revokeUserAll, revokeUserAll),
revokeMyOther: Object.assign(revokeMyOther, revokeMyOther),
}

export default sessions