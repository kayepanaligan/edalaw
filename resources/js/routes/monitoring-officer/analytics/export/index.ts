import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::csv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
export const csv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: csv.url(options),
    method: 'get',
})

csv.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/analytics/export/csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::csv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
csv.url = (options?: RouteQueryOptions) => {
    return csv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::csv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
csv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: csv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::csv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
csv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: csv.url(options),
    method: 'head',
})
const exportMethod = {
    csv: Object.assign(csv, csv),
}

export default exportMethod