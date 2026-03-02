import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
const index18a97b61a1ab56b7e28b8756b0f9c249 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index18a97b61a1ab56b7e28b8756b0f9c249.url(options),
    method: 'get',
})

index18a97b61a1ab56b7e28b8756b0f9c249.definition = {
    methods: ["get","head"],
    url: '/monitoring/video-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
index18a97b61a1ab56b7e28b8756b0f9c249.url = (options?: RouteQueryOptions) => {
    return index18a97b61a1ab56b7e28b8756b0f9c249.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
index18a97b61a1ab56b7e28b8756b0f9c249.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index18a97b61a1ab56b7e28b8756b0f9c249.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring/video-recordings'
 */
index18a97b61a1ab56b7e28b8756b0f9c249.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index18a97b61a1ab56b7e28b8756b0f9c249.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring-officer/video-recordings'
 */
const index81b91ddeca65ccfb3f3559b289529b7e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index81b91ddeca65ccfb3f3559b289529b7e.url(options),
    method: 'get',
})

index81b91ddeca65ccfb3f3559b289529b7e.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/video-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring-officer/video-recordings'
 */
index81b91ddeca65ccfb3f3559b289529b7e.url = (options?: RouteQueryOptions) => {
    return index81b91ddeca65ccfb3f3559b289529b7e.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring-officer/video-recordings'
 */
index81b91ddeca65ccfb3f3559b289529b7e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index81b91ddeca65ccfb3f3559b289529b7e.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/VideoRecordingsController.php:13
 * @route '/monitoring-officer/video-recordings'
 */
index81b91ddeca65ccfb3f3559b289529b7e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index81b91ddeca65ccfb3f3559b289529b7e.url(options),
    method: 'head',
})

export const index = {
    '/monitoring/video-recordings': index18a97b61a1ab56b7e28b8756b0f9c249,
    '/monitoring-officer/video-recordings': index81b91ddeca65ccfb3f3559b289529b7e,
}

const VideoRecordingsController = { index }

export default VideoRecordingsController