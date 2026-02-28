import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/time-slot-capacities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::update
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:76
 * @route '/admin/time-slot-capacities/{timeSlotCapacity}'
 */
export const update = (args: { timeSlotCapacity: number | { id: number } } | [timeSlotCapacity: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/time-slot-capacities/{timeSlotCapacity}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::update
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:76
 * @route '/admin/time-slot-capacities/{timeSlotCapacity}'
 */
update.url = (args: { timeSlotCapacity: number | { id: number } } | [timeSlotCapacity: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeSlotCapacity: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { timeSlotCapacity: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    timeSlotCapacity: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timeSlotCapacity: typeof args.timeSlotCapacity === 'object'
                ? args.timeSlotCapacity.id
                : args.timeSlotCapacity,
                }

    return update.definition.url
            .replace('{timeSlotCapacity}', parsedArgs.timeSlotCapacity.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::update
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:76
 * @route '/admin/time-slot-capacities/{timeSlotCapacity}'
 */
update.put = (args: { timeSlotCapacity: number | { id: number } } | [timeSlotCapacity: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::updateCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:93
 * @route '/admin/time-slot-capacities/update'
 */
export const updateCapacity = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCapacity.url(options),
    method: 'post',
})

updateCapacity.definition = {
    methods: ["post"],
    url: '/admin/time-slot-capacities/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::updateCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:93
 * @route '/admin/time-slot-capacities/update'
 */
updateCapacity.url = (options?: RouteQueryOptions) => {
    return updateCapacity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::updateCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:93
 * @route '/admin/time-slot-capacities/update'
 */
updateCapacity.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCapacity.url(options),
    method: 'post',
})
const timeSlotCapacities = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
updateCapacity: Object.assign(updateCapacity, updateCapacity),
}

export default timeSlotCapacities