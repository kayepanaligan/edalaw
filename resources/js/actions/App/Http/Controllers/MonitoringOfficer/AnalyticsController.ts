import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
const index58312bad964e01df095d455951e72e70 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index58312bad964e01df095d455951e72e70.url(options),
    method: 'get',
})

index58312bad964e01df095d455951e72e70.definition = {
    methods: ["get","head"],
    url: '/dashboard/monitoring-officer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
index58312bad964e01df095d455951e72e70.url = (options?: RouteQueryOptions) => {
    return index58312bad964e01df095d455951e72e70.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
index58312bad964e01df095d455951e72e70.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index58312bad964e01df095d455951e72e70.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/dashboard/monitoring-officer'
 */
index58312bad964e01df095d455951e72e70.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index58312bad964e01df095d455951e72e70.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
const index8295e0be48ed235b8531d77313174b55 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8295e0be48ed235b8531d77313174b55.url(options),
    method: 'get',
})

index8295e0be48ed235b8531d77313174b55.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
index8295e0be48ed235b8531d77313174b55.url = (options?: RouteQueryOptions) => {
    return index8295e0be48ed235b8531d77313174b55.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
index8295e0be48ed235b8531d77313174b55.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8295e0be48ed235b8531d77313174b55.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:19
 * @route '/monitoring-officer/analytics'
 */
index8295e0be48ed235b8531d77313174b55.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index8295e0be48ed235b8531d77313174b55.url(options),
    method: 'head',
})

export const index = {
    '/dashboard/monitoring-officer': index58312bad964e01df095d455951e72e70,
    '/monitoring-officer/analytics': index8295e0be48ed235b8531d77313174b55,
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::exportCsv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/analytics/export/csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::exportCsv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::exportCsv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AnalyticsController::exportCsv
 * @see app/Http/Controllers/MonitoringOfficer/AnalyticsController.php:274
 * @route '/monitoring-officer/analytics/export/csv'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})
const AnalyticsController = { index, exportCsv }

export default AnalyticsController