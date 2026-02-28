import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\NotificationController::index
 * @see app/Http/Controllers/Visitor/NotificationController.php:16
 * @route '/visitor/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\NotificationController::index
 * @see app/Http/Controllers/Visitor/NotificationController.php:16
 * @route '/visitor/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\NotificationController::index
 * @see app/Http/Controllers/Visitor/NotificationController.php:16
 * @route '/visitor/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\NotificationController::index
 * @see app/Http/Controllers/Visitor/NotificationController.php:16
 * @route '/visitor/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\NotificationController::read
 * @see app/Http/Controllers/Visitor/NotificationController.php:48
 * @route '/visitor/notifications/{notification}/read'
 */
export const read = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/visitor/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\NotificationController::read
 * @see app/Http/Controllers/Visitor/NotificationController.php:48
 * @route '/visitor/notifications/{notification}/read'
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
* @see \App\Http\Controllers\Visitor\NotificationController::read
 * @see app/Http/Controllers/Visitor/NotificationController.php:48
 * @route '/visitor/notifications/{notification}/read'
 */
read.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\NotificationController::readAll
 * @see app/Http/Controllers/Visitor/NotificationController.php:63
 * @route '/visitor/notifications/read-all'
 */
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/visitor/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\NotificationController::readAll
 * @see app/Http/Controllers/Visitor/NotificationController.php:63
 * @route '/visitor/notifications/read-all'
 */
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\NotificationController::readAll
 * @see app/Http/Controllers/Visitor/NotificationController.php:63
 * @route '/visitor/notifications/read-all'
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