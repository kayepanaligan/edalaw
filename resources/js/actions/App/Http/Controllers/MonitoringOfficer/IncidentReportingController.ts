import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\IncidentReportingController::index
 * @see app/Http/Controllers/MonitoringOfficer/IncidentReportingController.php:16
 * @route '/monitoring-officer/incidents'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/incidents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\IncidentReportingController::index
 * @see app/Http/Controllers/MonitoringOfficer/IncidentReportingController.php:16
 * @route '/monitoring-officer/incidents'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\IncidentReportingController::index
 * @see app/Http/Controllers/MonitoringOfficer/IncidentReportingController.php:16
 * @route '/monitoring-officer/incidents'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\IncidentReportingController::index
 * @see app/Http/Controllers/MonitoringOfficer/IncidentReportingController.php:16
 * @route '/monitoring-officer/incidents'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const IncidentReportingController = { index }

export default IncidentReportingController