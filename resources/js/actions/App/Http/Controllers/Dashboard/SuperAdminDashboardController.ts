import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
const SuperAdminDashboardController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SuperAdminDashboardController.url(options),
    method: 'get',
})

SuperAdminDashboardController.definition = {
    methods: ["get","head"],
    url: '/dashboard/super-admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
SuperAdminDashboardController.url = (options?: RouteQueryOptions) => {
    return SuperAdminDashboardController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
SuperAdminDashboardController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SuperAdminDashboardController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dashboard\SuperAdminDashboardController::__invoke
 * @see app/Http/Controllers/Dashboard/SuperAdminDashboardController.php:66
 * @route '/dashboard/super-admin'
 */
SuperAdminDashboardController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SuperAdminDashboardController.url(options),
    method: 'head',
})
export default SuperAdminDashboardController