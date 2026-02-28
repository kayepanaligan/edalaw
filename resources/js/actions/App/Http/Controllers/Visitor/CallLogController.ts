import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\CallLogController::index
 * @see app/Http/Controllers/Visitor/CallLogController.php:15
 * @route '/visitor/call-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/call-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\CallLogController::index
 * @see app/Http/Controllers/Visitor/CallLogController.php:15
 * @route '/visitor/call-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\CallLogController::index
 * @see app/Http/Controllers/Visitor/CallLogController.php:15
 * @route '/visitor/call-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\CallLogController::index
 * @see app/Http/Controllers/Visitor/CallLogController.php:15
 * @route '/visitor/call-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const CallLogController = { index }

export default CallLogController