import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InmateTunnelController::showEnterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
export const showEnterToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEnterToken.url(options),
    method: 'get',
})

showEnterToken.definition = {
    methods: ["get","head"],
    url: '/inmate-tunnel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::showEnterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
showEnterToken.url = (options?: RouteQueryOptions) => {
    return showEnterToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::showEnterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
showEnterToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEnterToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::showEnterToken
 * @see app/Http/Controllers/InmateTunnelController.php:24
 * @route '/inmate-tunnel'
 */
showEnterToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showEnterToken.url(options),
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
* @see \App\Http\Controllers\InmateTunnelController::getInmateToken
 * @see app/Http/Controllers/InmateTunnelController.php:154
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
 * @see app/Http/Controllers/InmateTunnelController.php:154
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
 * @see app/Http/Controllers/InmateTunnelController.php:154
 * @route '/inmate/join/{token}/token'
 */
getInmateToken.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getInmateToken.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::getInmateToken
 * @see app/Http/Controllers/InmateTunnelController.php:154
 * @route '/inmate/join/{token}/token'
 */
getInmateToken.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getInmateToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::listChat
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
export const listChat = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listChat.url(options),
    method: 'get',
})

listChat.definition = {
    methods: ["get","head"],
    url: '/inmate/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::listChat
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
listChat.url = (options?: RouteQueryOptions) => {
    return listChat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::listChat
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
listChat.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listChat.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::listChat
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
listChat.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listChat.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::sendChat
 * @see app/Http/Controllers/InmateTunnelController.php:195
 * @route '/inmate/chat'
 */
export const sendChat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendChat.url(options),
    method: 'post',
})

sendChat.definition = {
    methods: ["post"],
    url: '/inmate/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::sendChat
 * @see app/Http/Controllers/InmateTunnelController.php:195
 * @route '/inmate/chat'
 */
sendChat.url = (options?: RouteQueryOptions) => {
    return sendChat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::sendChat
 * @see app/Http/Controllers/InmateTunnelController.php:195
 * @route '/inmate/chat'
 */
sendChat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendChat.url(options),
    method: 'post',
})
const InmateTunnelController = { showEnterToken, verifyToken, join, getInmateToken, listChat, sendChat }

export default InmateTunnelController