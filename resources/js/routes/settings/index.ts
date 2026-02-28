import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::timeSlotCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
export const timeSlotCapacity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: timeSlotCapacity.url(options),
    method: 'get',
})

timeSlotCapacity.definition = {
    methods: ["get","head"],
    url: '/settings/time-slot-capacity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::timeSlotCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
timeSlotCapacity.url = (options?: RouteQueryOptions) => {
    return timeSlotCapacity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::timeSlotCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
timeSlotCapacity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: timeSlotCapacity.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::timeSlotCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
timeSlotCapacity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: timeSlotCapacity.url(options),
    method: 'head',
})
const settings = {
    timeSlotCapacity: Object.assign(timeSlotCapacity, timeSlotCapacity),
}

export default settings