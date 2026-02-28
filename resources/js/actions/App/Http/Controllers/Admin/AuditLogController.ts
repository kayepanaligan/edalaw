import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
 * @see app/Http/Controllers/Admin/AuditLogController.php:18
 * @route '/admin/audit-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
 * @see app/Http/Controllers/Admin/AuditLogController.php:18
 * @route '/admin/audit-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
 * @see app/Http/Controllers/Admin/AuditLogController.php:18
 * @route '/admin/audit-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
 * @see app/Http/Controllers/Admin/AuditLogController.php:18
 * @route '/admin/audit-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::exportMethod
 * @see app/Http/Controllers/Admin/AuditLogController.php:117
 * @route '/admin/audit-logs/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/audit-logs/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuditLogController::exportMethod
 * @see app/Http/Controllers/Admin/AuditLogController.php:117
 * @route '/admin/audit-logs/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuditLogController::exportMethod
 * @see app/Http/Controllers/Admin/AuditLogController.php:117
 * @route '/admin/audit-logs/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AuditLogController::exportMethod
 * @see app/Http/Controllers/Admin/AuditLogController.php:117
 * @route '/admin/audit-logs/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})
const AuditLogController = { index, exportMethod, export: exportMethod }

export default AuditLogController