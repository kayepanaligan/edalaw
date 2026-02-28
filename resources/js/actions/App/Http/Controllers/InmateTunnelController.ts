import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InmateTunnelController::join
 * @see app/Http/Controllers/InmateTunnelController.php:17
 * @route '/inmate/join/{token}'
 */
export const join = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})

join.definition = {
    methods: ["get","head"],
    url: '/inmate/join/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::join
 * @see app/Http/Controllers/InmateTunnelController.php:17
 * @route '/inmate/join/{token}'
 */
join.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return join.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::join
 * @see app/Http/Controllers/InmateTunnelController.php:17
 * @route '/inmate/join/{token}'
 */
join.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::join
 * @see app/Http/Controllers/InmateTunnelController.php:17
 * @route '/inmate/join/{token}'
 */
join.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: join.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::getInmateToken
 * @see app/Http/Controllers/InmateTunnelController.php:48
 * @route '/inmate/join/{token}/token'
 */
export const getInmateToken = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getInmateToken.url(args, options),
    method: 'get',
})

getInmateToken.definition = {
    methods: ["get","head"],
    url: '/inmate/join/{token}/token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::getInmateToken
 * @see app/Http/Controllers/InmateTunnelController.php:48
 * @route '/inmate/join/{token}/token'
 */
getInmateToken.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return getInmateToken.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::getInmateToken
 * @see app/Http/Controllers/InmateTunnelController.php:48
 * @route '/inmate/join/{token}/token'
 */
getInmateToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getInmateToken.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::getInmateToken
 * @see app/Http/Controllers/InmateTunnelController.php:48
 * @route '/inmate/join/{token}/token'
 */
getInmateToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getInmateToken.url(args, options),
    method: 'head',
})
const InmateTunnelController = { join, getInmateToken }

export default InmateTunnelController