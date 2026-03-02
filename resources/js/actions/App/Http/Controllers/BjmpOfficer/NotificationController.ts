import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::index
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:16
 * @route '/bjmp-officer/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::index
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:16
 * @route '/bjmp-officer/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::index
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:16
 * @route '/bjmp-officer/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::index
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:16
 * @route '/bjmp-officer/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::markAsRead
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:48
 * @route '/bjmp-officer/notifications/{notification}/read'
 */
export const markAsRead = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/bjmp-officer/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::markAsRead
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:48
 * @route '/bjmp-officer/notifications/{notification}/read'
 */
markAsRead.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return markAsRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::markAsRead
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:48
 * @route '/bjmp-officer/notifications/{notification}/read'
 */
markAsRead.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::markAllAsRead
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:62
 * @route '/bjmp-officer/notifications/read-all'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/bjmp-officer/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::markAllAsRead
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:62
 * @route '/bjmp-officer/notifications/read-all'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\NotificationController::markAllAsRead
 * @see app/Http/Controllers/BjmpOfficer/NotificationController.php:62
 * @route '/bjmp-officer/notifications/read-all'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})
const NotificationController = { index, markAsRead, markAllAsRead }

export default NotificationController