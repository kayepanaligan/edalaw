import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
export const bookedSlots = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookedSlots.url(options),
    method: 'get',
})

bookedSlots.definition = {
    methods: ["get","head"],
    url: '/visitor/schedules/booked-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
bookedSlots.url = (options?: RouteQueryOptions) => {
    return bookedSlots.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
bookedSlots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookedSlots.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\ScheduleController::bookedSlots
 * @see app/Http/Controllers/Visitor/ScheduleController.php:155
 * @route '/visitor/schedules/booked-slots'
 */
bookedSlots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bookedSlots.url(options),
    method: 'head',
})
const schedules = {
    bookedSlots: Object.assign(bookedSlots, bookedSlots),
}

export default schedules