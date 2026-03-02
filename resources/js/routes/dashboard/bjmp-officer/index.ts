import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::overviewData
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:32
 * @route '/dashboard/bjmp-officer/overview-data'
 */
export const overviewData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overviewData.url(options),
    method: 'get',
})

overviewData.definition = {
    methods: ["get","head"],
    url: '/dashboard/bjmp-officer/overview-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::overviewData
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:32
 * @route '/dashboard/bjmp-officer/overview-data'
 */
overviewData.url = (options?: RouteQueryOptions) => {
    return overviewData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::overviewData
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:32
 * @route '/dashboard/bjmp-officer/overview-data'
 */
overviewData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overviewData.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::overviewData
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:32
 * @route '/dashboard/bjmp-officer/overview-data'
 */
overviewData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overviewData.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportOverview
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
export const exportOverview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportOverview.url(options),
    method: 'get',
})

exportOverview.definition = {
    methods: ["get","head"],
    url: '/dashboard/bjmp-officer/export-overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportOverview
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
exportOverview.url = (options?: RouteQueryOptions) => {
    return exportOverview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportOverview
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
exportOverview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportOverview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportOverview
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
exportOverview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportOverview.url(options),
    method: 'head',
})
const bjmpOfficer = {
    overviewData: Object.assign(overviewData, overviewData),
exportOverview: Object.assign(exportOverview, exportOverview),
}

export default bjmpOfficer