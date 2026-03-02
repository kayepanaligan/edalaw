import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring/chat-recordings'
 */
const index0d48c9ac0c21f15a63aef3596ac6ea7d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index0d48c9ac0c21f15a63aef3596ac6ea7d.url(options),
    method: 'get',
})

index0d48c9ac0c21f15a63aef3596ac6ea7d.definition = {
    methods: ["get","head"],
    url: '/monitoring/chat-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring/chat-recordings'
 */
index0d48c9ac0c21f15a63aef3596ac6ea7d.url = (options?: RouteQueryOptions) => {
    return index0d48c9ac0c21f15a63aef3596ac6ea7d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring/chat-recordings'
 */
index0d48c9ac0c21f15a63aef3596ac6ea7d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index0d48c9ac0c21f15a63aef3596ac6ea7d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring/chat-recordings'
 */
index0d48c9ac0c21f15a63aef3596ac6ea7d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index0d48c9ac0c21f15a63aef3596ac6ea7d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
const indexa6fef91b578c7b31b1aad721a6f1e36b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexa6fef91b578c7b31b1aad721a6f1e36b.url(options),
    method: 'get',
})

indexa6fef91b578c7b31b1aad721a6f1e36b.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/chat-recordings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
indexa6fef91b578c7b31b1aad721a6f1e36b.url = (options?: RouteQueryOptions) => {
    return indexa6fef91b578c7b31b1aad721a6f1e36b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
indexa6fef91b578c7b31b1aad721a6f1e36b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexa6fef91b578c7b31b1aad721a6f1e36b.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::index
 * @see app/Http/Controllers/MonitoringOfficer/ChatRecordingsController.php:16
 * @route '/monitoring-officer/chat-recordings'
 */
indexa6fef91b578c7b31b1aad721a6f1e36b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexa6fef91b578c7b31b1aad721a6f1e36b.url(options),
    method: 'head',
})

export const index = {
    '/monitoring/chat-recordings': index0d48c9ac0c21f15a63aef3596ac6ea7d,
    '/monitoring-officer/chat-recordings': indexa6fef91b578c7b31b1aad721a6f1e36b,
}

const ChatRecordingsController = { index }

export default ChatRecordingsController