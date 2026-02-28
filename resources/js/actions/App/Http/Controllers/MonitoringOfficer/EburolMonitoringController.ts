import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
const EburolMonitoringController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EburolMonitoringController.url(options),
    method: 'get',
})

EburolMonitoringController.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/eburol-monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
EburolMonitoringController.url = (options?: RouteQueryOptions) => {
    return EburolMonitoringController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
EburolMonitoringController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EburolMonitoringController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
EburolMonitoringController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EburolMonitoringController.url(options),
    method: 'head',
})
export default EburolMonitoringController