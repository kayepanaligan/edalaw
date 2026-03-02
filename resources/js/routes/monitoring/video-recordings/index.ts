import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring/video-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const videoRecordings = {
    index: Object.assign(index, index),
}

export default videoRecordings