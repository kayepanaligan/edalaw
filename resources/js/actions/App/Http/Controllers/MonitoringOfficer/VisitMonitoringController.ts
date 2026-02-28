import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
const VisitMonitoringController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VisitMonitoringController.url(options),
    method: 'get',
})

VisitMonitoringController.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/visit-monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
VisitMonitoringController.url = (options?: RouteQueryOptions) => {
    return VisitMonitoringController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
VisitMonitoringController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VisitMonitoringController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
VisitMonitoringController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: VisitMonitoringController.url(options),
    method: 'head',
})
export default VisitMonitoringController