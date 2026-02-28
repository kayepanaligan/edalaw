import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\AuditLogController::index
 * @see app/Http/Controllers/Visitor/AuditLogController.php:15
 * @route '/visitor/history'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\AuditLogController::index
 * @see app/Http/Controllers/Visitor/AuditLogController.php:15
 * @route '/visitor/history'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\AuditLogController::index
 * @see app/Http/Controllers/Visitor/AuditLogController.php:15
 * @route '/visitor/history'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\AuditLogController::index
 * @see app/Http/Controllers/Visitor/AuditLogController.php:15
 * @route '/visitor/history'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const AuditLogController = { index }

export default AuditLogController