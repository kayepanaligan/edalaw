import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\IncidentReportingController::index
 * @see app/Http/Controllers/Admin/IncidentReportingController.php:16
 * @route '/admin/incident-reporting'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/incident-reporting',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\IncidentReportingController::index
 * @see app/Http/Controllers/Admin/IncidentReportingController.php:16
 * @route '/admin/incident-reporting'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IncidentReportingController::index
 * @see app/Http/Controllers/Admin/IncidentReportingController.php:16
 * @route '/admin/incident-reporting'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\IncidentReportingController::index
 * @see app/Http/Controllers/Admin/IncidentReportingController.php:16
 * @route '/admin/incident-reporting'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const IncidentReportingController = { index }

export default IncidentReportingController