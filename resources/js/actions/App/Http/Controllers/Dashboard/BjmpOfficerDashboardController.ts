import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:11
 * @route '/dashboard/bjmp-officer'
 */
const BjmpOfficerDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: BjmpOfficerDashboardController.url(options),
    method: 'get',
})

BjmpOfficerDashboardController.definition = {
    methods: ["get","head"],
    url: '/dashboard/bjmp-officer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:11
 * @route '/dashboard/bjmp-officer'
 */
BjmpOfficerDashboardController.url = (options?: RouteQueryOptions) => {
    return BjmpOfficerDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:11
 * @route '/dashboard/bjmp-officer'
 */
BjmpOfficerDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: BjmpOfficerDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/BjmpOfficerDashboardController.php:11
 * @route '/dashboard/bjmp-officer'
 */
BjmpOfficerDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: BjmpOfficerDashboardController.url(options),
    method: 'head',
})
export default BjmpOfficerDashboardController