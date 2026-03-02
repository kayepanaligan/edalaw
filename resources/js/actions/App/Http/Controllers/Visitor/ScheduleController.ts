import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
const getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.url(options),
    method: 'get',
})

getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.definition = {
    methods: ["get","head"],
    url: '/visitor/schedules/booked-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.url = (options?: RouteQueryOptions) => {
    return getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedule/booked-slots'
 */
const getBookedTimeSlotsd880ba23bb585600049738e87cd633a9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.url(options),
    method: 'get',
})

getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.definition = {
    methods: ["get","head"],
    url: '/visitor/schedule/booked-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedule/booked-slots'
 */
getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.url = (options?: RouteQueryOptions) => {
    return getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedule/booked-slots'
 */
getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::getBookedTimeSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedule/booked-slots'
 */
getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getBookedTimeSlotsd880ba23bb585600049738e87cd633a9.url(options),
    method: 'head',
})

export const getBookedTimeSlots = {
    '/visitor/schedules/booked-slots': getBookedTimeSlotsf752fa42236fa6d31b434e3875521c1d,
    '/visitor/schedule/booked-slots': getBookedTimeSlotsd880ba23bb585600049738e87cd633a9,
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:28
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
 * @see app/Http/Controllers/Visitor/ScheduleController.php:28
 * @route '/visitor/schedule'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:28
 * @route '/visitor/schedule'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::index
 * @see app/Http/Controllers/Visitor/ScheduleController.php:28
 * @route '/visitor/schedule'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::store
 * @see app/Http/Controllers/Visitor/ScheduleController.php:243
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
 * @see app/Http/Controllers/Visitor/ScheduleController.php:243
 * @route '/visitor/schedule'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::store
 * @see app/Http/Controllers/Visitor/ScheduleController.php:243
 * @route '/visitor/schedule'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::cancel
 * @see app/Http/Controllers/Visitor/ScheduleController.php:361
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
 * @see app/Http/Controllers/Visitor/ScheduleController.php:361
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
 * @see app/Http/Controllers/Visitor/ScheduleController.php:361
 * @route '/visitor/schedule/{visit}/cancel'
 */
cancel.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::reschedule
 * @see app/Http/Controllers/Visitor/ScheduleController.php:402
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
 * @see app/Http/Controllers/Visitor/ScheduleController.php:402
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
 * @see app/Http/Controllers/Visitor/ScheduleController.php:402
 * @route '/visitor/schedule/{visit}/reschedule'
 */
reschedule.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::searchInmate
 * @see app/Http/Controllers/Visitor/ScheduleController.php:485
 * @route '/visitor/schedule/search-inmate'
 */
export const searchInmate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchInmate.url(options),
    method: 'post',
})

searchInmate.definition = {
    methods: ["post"],
    url: '/visitor/schedule/search-inmate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::searchInmate
 * @see app/Http/Controllers/Visitor/ScheduleController.php:485
 * @route '/visitor/schedule/search-inmate'
 */
searchInmate.url = (options?: RouteQueryOptions) => {
    return searchInmate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::searchInmate
 * @see app/Http/Controllers/Visitor/ScheduleController.php:485
 * @route '/visitor/schedule/search-inmate'
 */
searchInmate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchInmate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::checkCellAvailability
 * @see app/Http/Controllers/Visitor/ScheduleController.php:540
 * @route '/visitor/schedule/check-cell-availability'
 */
export const checkCellAvailability = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkCellAvailability.url(options),
    method: 'post',
})

checkCellAvailability.definition = {
    methods: ["post"],
    url: '/visitor/schedule/check-cell-availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::checkCellAvailability
 * @see app/Http/Controllers/Visitor/ScheduleController.php:540
 * @route '/visitor/schedule/check-cell-availability'
 */
checkCellAvailability.url = (options?: RouteQueryOptions) => {
    return checkCellAvailability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::checkCellAvailability
 * @see app/Http/Controllers/Visitor/ScheduleController.php:540
 * @route '/visitor/schedule/check-cell-availability'
 */
checkCellAvailability.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkCellAvailability.url(options),
    method: 'post',
})
const ScheduleController = { getBookedTimeSlots, index, store, cancel, reschedule, searchInmate, checkCellAvailability }

export default ScheduleController