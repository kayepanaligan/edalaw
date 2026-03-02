import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\HistoryController::index
 * @see app/Http/Controllers/MonitoringOfficer/HistoryController.php:16
 * @route '/monitoring-officer/history'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\HistoryController::index
 * @see app/Http/Controllers/MonitoringOfficer/HistoryController.php:16
 * @route '/monitoring-officer/history'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\HistoryController::index
 * @see app/Http/Controllers/MonitoringOfficer/HistoryController.php:16
 * @route '/monitoring-officer/history'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\HistoryController::index
 * @see app/Http/Controllers/MonitoringOfficer/HistoryController.php:16
 * @route '/monitoring-officer/history'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const history = {
    index: Object.assign(index, index),
}

export default history