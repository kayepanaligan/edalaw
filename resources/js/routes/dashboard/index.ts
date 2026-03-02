import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import bjmpOfficerD3b56b from './bjmp-officer'
/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
export const visitor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visitor.url(options),
    method: 'get',
})

visitor.definition = {
    methods: ["get","head"],
    url: '/dashboard/visitor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
visitor.url = (options?: RouteQueryOptions) => {
    return visitor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
visitor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visitor.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
visitor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visitor.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
export const superAdmin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superAdmin.url(options),
    method: 'get',
})

superAdmin.definition = {
    methods: ["get","head"],
    url: '/dashboard/super-admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
superAdmin.url = (options?: RouteQueryOptions) => {
    return superAdmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
superAdmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superAdmin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
superAdmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: superAdmin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::bjmpOfficer
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
export const bjmpOfficer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bjmpOfficer.url(options),
    method: 'get',
})

bjmpOfficer.definition = {
    methods: ["get","head"],
    url: '/dashboard/bjmp-officer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::bjmpOfficer
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
bjmpOfficer.url = (options?: RouteQueryOptions) => {
    return bjmpOfficer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::bjmpOfficer
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
bjmpOfficer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bjmpOfficer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::bjmpOfficer
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
bjmpOfficer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bjmpOfficer.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::monitoringOfficer
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
export const monitoringOfficer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitoringOfficer.url(options),
    method: 'get',
})

monitoringOfficer.definition = {
    methods: ["get","head"],
    url: '/dashboard/monitoring-officer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::monitoringOfficer
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
monitoringOfficer.url = (options?: RouteQueryOptions) => {
    return monitoringOfficer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::monitoringOfficer
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
monitoringOfficer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitoringOfficer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::monitoringOfficer
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
monitoringOfficer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: monitoringOfficer.url(options),
    method: 'head',
})
const dashboard = {
    visitor: Object.assign(visitor, visitor),
superAdmin: Object.assign(superAdmin, superAdmin),
bjmpOfficer: Object.assign(bjmpOfficer, bjmpOfficerD3b56b),
monitoringOfficer: Object.assign(monitoringOfficer, monitoringOfficer),
}

export default dashboard