import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
export const __invoke = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})

__invoke.definition = {
    methods: ["get","head"],
    url: '/dashboard/bjmp-officer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
__invoke.url = (options?: RouteQueryOptions) => {
    return __invoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
__invoke.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:14
 * @route '/dashboard/bjmp-officer'
 */
__invoke.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: __invoke.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportCsv
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/dashboard/bjmp-officer/export-overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportCsv
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
exportCsv.url = (options?: RouteQueryOptions) => {
    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportCsv
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::exportCsv
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:48
 * @route '/dashboard/bjmp-officer/export-overview'
 */
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})
const BjmpOfficerDashboardController = { __invoke, overviewData, exportCsv }

export default BjmpOfficerDashboardController