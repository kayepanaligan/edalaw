import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/chat-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const chatRecordings = {
    index: Object.assign(index, index),
}

export default chatRecordings