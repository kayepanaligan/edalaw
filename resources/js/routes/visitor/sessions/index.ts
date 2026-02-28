import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\SessionController::index
 * @see app/Http/Controllers/Visitor/SessionController.php:17
 * @route '/visitor/sessions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/sessions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\SessionController::index
 * @see app/Http/Controllers/Visitor/SessionController.php:17
 * @route '/visitor/sessions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\SessionController::index
 * @see app/Http/Controllers/Visitor/SessionController.php:17
 * @route '/visitor/sessions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\SessionController::index
 * @see app/Http/Controllers/Visitor/SessionController.php:17
 * @route '/visitor/sessions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\SessionController::revoke
 * @see app/Http/Controllers/Visitor/SessionController.php:48
 * @route '/visitor/sessions/{session}'
 */
export const revoke = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

revoke.definition = {
    methods: ["delete"],
    url: '/visitor/sessions/{session}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Visitor\SessionController::revoke
 * @see app/Http/Controllers/Visitor/SessionController.php:48
 * @route '/visitor/sessions/{session}'
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
* @see \App\Http\Controllers\Visitor\SessionController::revoke
 * @see app/Http/Controllers/Visitor/SessionController.php:48
 * @route '/visitor/sessions/{session}'
 */
revoke.delete = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Visitor\SessionController::revokeAll
 * @see app/Http/Controllers/Visitor/SessionController.php:76
 * @route '/visitor/sessions/revoke-all'
 */
export const revokeAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeAll.url(options),
    method: 'post',
})

revokeAll.definition = {
    methods: ["post"],
    url: '/visitor/sessions/revoke-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\SessionController::revokeAll
 * @see app/Http/Controllers/Visitor/SessionController.php:76
 * @route '/visitor/sessions/revoke-all'
 */
revokeAll.url = (options?: RouteQueryOptions) => {
    return revokeAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\SessionController::revokeAll
 * @see app/Http/Controllers/Visitor/SessionController.php:76
 * @route '/visitor/sessions/revoke-all'
 */
revokeAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeAll.url(options),
    method: 'post',
})
const sessions = {
    index: Object.assign(index, index),
revoke: Object.assign(revoke, revoke),
revokeAll: Object.assign(revokeAll, revokeAll),
}

export default sessions