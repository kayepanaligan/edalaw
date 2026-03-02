import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::index
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:13
 * @route '/monitoring-officer/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::index
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:13
 * @route '/monitoring-officer/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::index
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:13
 * @route '/monitoring-officer/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::index
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:13
 * @route '/monitoring-officer/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::read
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:38
 * @route '/monitoring-officer/notifications/{notification}/read'
 */
export const read = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/monitoring-officer/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::read
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:38
 * @route '/monitoring-officer/notifications/{notification}/read'
 */
read.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return read.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::read
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:38
 * @route '/monitoring-officer/notifications/{notification}/read'
 */
read.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::readAll
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:48
 * @route '/monitoring-officer/notifications/read-all'
 */
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/monitoring-officer/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::readAll
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:48
 * @route '/monitoring-officer/notifications/read-all'
 */
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\NotificationController::readAll
 * @see app/Http/Controllers/MonitoringOfficer/NotificationController.php:48
 * @route '/monitoring-officer/notifications/read-all'
 */
readAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})
const notifications = {
    index: Object.assign(index, index),
read: Object.assign(read, read),
readAll: Object.assign(readAll, readAll),
}

export default notifications