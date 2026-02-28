import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\MonitoringOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/MonitoringOfficerDashboardController.php:13
 * @route '/dashboard/monitoring-officer'
 */
const MonitoringOfficerDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MonitoringOfficerDashboardController.url(options),
    method: 'get',
})

MonitoringOfficerDashboardController.definition = {
    methods: ["get","head"],
    url: '/dashboard/monitoring-officer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\MonitoringOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/MonitoringOfficerDashboardController.php:13
 * @route '/dashboard/monitoring-officer'
 */
MonitoringOfficerDashboardController.url = (options?: RouteQueryOptions) => {
    return MonitoringOfficerDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\MonitoringOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/MonitoringOfficerDashboardController.php:13
 * @route '/dashboard/monitoring-officer'
 */
MonitoringOfficerDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: MonitoringOfficerDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\MonitoringOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/MonitoringOfficerDashboardController.php:13
 * @route '/dashboard/monitoring-officer'
 */
MonitoringOfficerDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: MonitoringOfficerDashboardController.url(options),
    method: 'head',
})
export default MonitoringOfficerDashboardController