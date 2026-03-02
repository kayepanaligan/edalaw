import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import exportMethod from './export'
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const analytics = {
    index: Object.assign(index, index),
export: Object.assign(exportMethod, exportMethod),
}

export default analytics