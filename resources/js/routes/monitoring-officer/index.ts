import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import assignedSessions from './assigned-sessions'
/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
export const visitMonitoring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visitMonitoring.url(options),
    method: 'get',
})

visitMonitoring.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/visit-monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
visitMonitoring.url = (options?: RouteQueryOptions) => {
    return visitMonitoring.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
visitMonitoring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: visitMonitoring.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/VisitMonitoringController.php:16
 * @route '/monitoring-officer/visit-monitoring'
 */
visitMonitoring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: visitMonitoring.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
export const eburolMonitoring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eburolMonitoring.url(options),
    method: 'get',
})

eburolMonitoring.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/eburol-monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
eburolMonitoring.url = (options?: RouteQueryOptions) => {
    return eburolMonitoring.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
eburolMonitoring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eburolMonitoring.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::__invoke
 * @see app/Http/Controllers/MonitoringOfficer/EburolMonitoringController.php:16
 * @route '/monitoring-officer/eburol-monitoring'
 */
eburolMonitoring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eburolMonitoring.url(options),
    method: 'head',
})
const monitoringOfficer = {
    visitMonitoring: Object.assign(visitMonitoring, visitMonitoring),
eburolMonitoring: Object.assign(eburolMonitoring, eburolMonitoring),
assignedSessions: Object.assign(assignedSessions, assignedSessions),
}

export default monitoringOfficer