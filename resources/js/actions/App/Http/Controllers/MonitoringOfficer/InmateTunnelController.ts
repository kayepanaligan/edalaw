import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\InmateTunnelController::index
 * @see app/Http/Controllers/MonitoringOfficer/InmateTunnelController.php:16
 * @route '/monitoring-officer/inmate-tunnels'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/inmate-tunnels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\InmateTunnelController::index
 * @see app/Http/Controllers/MonitoringOfficer/InmateTunnelController.php:16
 * @route '/monitoring-officer/inmate-tunnels'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\InmateTunnelController::index
 * @see app/Http/Controllers/MonitoringOfficer/InmateTunnelController.php:16
 * @route '/monitoring-officer/inmate-tunnels'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\InmateTunnelController::index
 * @see app/Http/Controllers/MonitoringOfficer/InmateTunnelController.php:16
 * @route '/monitoring-officer/inmate-tunnels'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const InmateTunnelController = { index }

export default InmateTunnelController