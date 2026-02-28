import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
const VisitorDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VisitorDashboardController.url(options),
    method: 'get',
})

VisitorDashboardController.definition = {
    methods: ["get","head"],
    url: '/dashboard/visitor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
VisitorDashboardController.url = (options?: RouteQueryOptions) => {
    return VisitorDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
VisitorDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: VisitorDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\VisitorDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/VisitorDashboardController.php:21
 * @route '/dashboard/visitor'
 */
VisitorDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: VisitorDashboardController.url(options),
    method: 'head',
})
export default VisitorDashboardController