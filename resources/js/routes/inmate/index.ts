import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import chat from './chat'
/**
* @see \App\Http\Controllers\InmateTunnelController::enterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
export const enterToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enterToken.url(options),
    method: 'get',
})

enterToken.definition = {
    methods: ["get","head"],
    url: '/inmate-tunnel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::enterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
enterToken.url = (options?: RouteQueryOptions) => {
    return enterToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::enterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
enterToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enterToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::enterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
enterToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: enterToken.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::verifyToken
 * @see app/Http/Controllers/InmateTunnelController.php:35
 * @route '/inmate-tunnel'
 */
export const verifyToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyToken.url(options),
    method: 'post',
})

verifyToken.definition = {
    methods: ["post"],
    url: '/inmate-tunnel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::verifyToken
 * @see app/Http/Controllers/InmateTunnelController.php:35
 * @route '/inmate-tunnel'
 */
verifyToken.url = (options?: RouteQueryOptions) => {
    return verifyToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::verifyToken
 * @see app/Http/Controllers/InmateTunnelController.php:35
 * @route '/inmate-tunnel'
 */
verifyToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::join
 * @see app/Http/Controllers/InmateTunnelController.php:94
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
 * @see app/Http/Controllers/InmateTunnelController.php:94
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
 * @see app/Http/Controllers/InmateTunnelController.php:94
 * @route '/inmate/join/{token}'
 */
join.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::join
 * @see app/Http/Controllers/InmateTunnelController.php:94
 * @route '/inmate/join/{token}'
 */
join.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: join.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::token
 * @see app/Http/Controllers/InmateTunnelController.php:154
 * @route '/inmate/join/{token}/token'
 */
export const token = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: token.url(args, options),
    method: 'get',
})

token.definition = {
    methods: ["get","head"],
    url: '/inmate/join/{token}/token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::token
 * @see app/Http/Controllers/InmateTunnelController.php:154
 * @route '/inmate/join/{token}/token'
 */
token.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return token.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::token
 * @see app/Http/Controllers/InmateTunnelController.php:154
 * @route '/inmate/join/{token}/token'
 */
token.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: token.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::token
 * @see app/Http/Controllers/InmateTunnelController.php:154
 * @route '/inmate/join/{token}/token'
 */
token.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: token.url(args, options),
    method: 'head',
})
const inmate = {
    enterToken: Object.assign(enterToken, enterToken),
verifyToken: Object.assign(verifyToken, verifyToken),
join: Object.assign(join, join),
token: Object.assign(token, token),
chat: Object.assign(chat, chat),
}

export default inmate