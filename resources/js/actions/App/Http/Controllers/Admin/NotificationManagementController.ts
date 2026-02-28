import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::index
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:16
 * @route '/admin/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::index
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:16
 * @route '/admin/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::index
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:16
 * @route '/admin/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::index
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:16
 * @route '/admin/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::markAsRead
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:62
 * @route '/admin/notifications/{notification}/read'
 */
export const markAsRead = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/admin/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::markAsRead
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:62
 * @route '/admin/notifications/{notification}/read'
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
* @see \App\Http\Controllers\Admin\NotificationManagementController::markAsRead
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:62
 * @route '/admin/notifications/{notification}/read'
 */
markAsRead.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::markAllAsRead
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:77
 * @route '/admin/notifications/read-all'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/admin/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::markAllAsRead
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:77
 * @route '/admin/notifications/read-all'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationManagementController::markAllAsRead
 * @see app/Http/Controllers/Admin/NotificationManagementController.php:77
 * @route '/admin/notifications/read-all'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})
const NotificationManagementController = { index, markAsRead, markAllAsRead }

export default NotificationManagementController