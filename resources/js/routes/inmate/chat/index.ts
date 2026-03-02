import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InmateTunnelController::list
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/inmate/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::list
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::list
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InmateTunnelController::list
 * @see app/Http/Controllers/InmateTunnelController.php:278
 * @route '/inmate/chat'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InmateTunnelController::send
 * @see app/Http/Controllers/InmateTunnelController.php:195
 * @route '/inmate/chat'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/inmate/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InmateTunnelController::send
 * @see app/Http/Controllers/InmateTunnelController.php:195
 * @route '/inmate/chat'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InmateTunnelController::send
 * @see app/Http/Controllers/InmateTunnelController.php:195
 * @route '/inmate/chat'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})
const chat = {
    list: Object.assign(list, list),
send: Object.assign(send, send),
}

export default chat