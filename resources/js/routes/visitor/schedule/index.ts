import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:24
 * @route '/visitor/schedule'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/schedule',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:24
 * @route '/visitor/schedule'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:24
 * @route '/visitor/schedule'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:24
 * @route '/visitor/schedule'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::store
 * @see app/Http/Controllers/Visitor/ScheduleController.php:173
 * @route '/visitor/schedule'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visitor/schedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::store
 * @see app/Http/Controllers/Visitor/ScheduleController.php:173
 * @route '/visitor/schedule'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::store
 * @see app/Http/Controllers/Visitor/ScheduleController.php:173
 * @route '/visitor/schedule'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::cancel
 * @see app/Http/Controllers/Visitor/ScheduleController.php:260
 * @route '/visitor/schedule/{visit}/cancel'
 */
export const cancel = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/visitor/schedule/{visit}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::cancel
 * @see app/Http/Controllers/Visitor/ScheduleController.php:260
 * @route '/visitor/schedule/{visit}/cancel'
 */
cancel.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { visit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { visit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    visit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        visit: typeof args.visit === 'object'
                ? args.visit.id
                : args.visit,
                }

    return cancel.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::cancel
 * @see app/Http/Controllers/Visitor/ScheduleController.php:260
 * @route '/visitor/schedule/{visit}/cancel'
 */
cancel.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::reschedule
 * @see app/Http/Controllers/Visitor/ScheduleController.php:301
 * @route '/visitor/schedule/{visit}/reschedule'
 */
export const reschedule = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})

reschedule.definition = {
    methods: ["post"],
    url: '/visitor/schedule/{visit}/reschedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::reschedule
 * @see app/Http/Controllers/Visitor/ScheduleController.php:301
 * @route '/visitor/schedule/{visit}/reschedule'
 */
reschedule.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { visit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { visit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    visit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        visit: typeof args.visit === 'object'
                ? args.visit.id
                : args.visit,
                }

    return reschedule.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::reschedule
 * @see app/Http/Controllers/Visitor/ScheduleController.php:301
 * @route '/visitor/schedule/{visit}/reschedule'
 */
reschedule.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:133
 * @route '/visitor/schedule/booked-slots'
 */
export const bookedSlots = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookedSlots.url(options),
    method: 'get',
})

bookedSlots.definition = {
    methods: ["get","head"],
    url: '/visitor/schedule/booked-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:133
 * @route '/visitor/schedule/booked-slots'
 */
bookedSlots.url = (options?: RouteQueryOptions) => {
    return bookedSlots.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:133
 * @route '/visitor/schedule/booked-slots'
 */
bookedSlots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookedSlots.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:133
 * @route '/visitor/schedule/booked-slots'
 */
bookedSlots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bookedSlots.url(options),
    method: 'head',
})
const schedule = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
cancel: Object.assign(cancel, cancel),
reschedule: Object.assign(reschedule, reschedule),
bookedSlots: Object.assign(bookedSlots, bookedSlots),
}

export default schedule