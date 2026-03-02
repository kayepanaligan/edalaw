import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
const indexd58f46ea7cd0aa5de30b2a10db37a96e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd58f46ea7cd0aa5de30b2a10db37a96e.url(options),
    method: 'get',
})

indexd58f46ea7cd0aa5de30b2a10db37a96e.definition = {
    methods: ["get","head"],
    url: '/admin/time-slot-capacities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
indexd58f46ea7cd0aa5de30b2a10db37a96e.url = (options?: RouteQueryOptions) => {
    return indexd58f46ea7cd0aa5de30b2a10db37a96e.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
indexd58f46ea7cd0aa5de30b2a10db37a96e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd58f46ea7cd0aa5de30b2a10db37a96e.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/admin/time-slot-capacities'
 */
indexd58f46ea7cd0aa5de30b2a10db37a96e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexd58f46ea7cd0aa5de30b2a10db37a96e.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
const index31ebd148c98730e1059506f2a591a917 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index31ebd148c98730e1059506f2a591a917.url(options),
    method: 'get',
})

index31ebd148c98730e1059506f2a591a917.definition = {
    methods: ["get","head"],
    url: '/settings/time-slot-capacity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
index31ebd148c98730e1059506f2a591a917.url = (options?: RouteQueryOptions) => {
    return index31ebd148c98730e1059506f2a591a917.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
index31ebd148c98730e1059506f2a591a917.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index31ebd148c98730e1059506f2a591a917.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::index
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:17
 * @route '/settings/time-slot-capacity'
 */
index31ebd148c98730e1059506f2a591a917.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index31ebd148c98730e1059506f2a591a917.url(options),
    method: 'head',
})

export const index = {
    '/admin/time-slot-capacities': indexd58f46ea7cd0aa5de30b2a10db37a96e,
    '/settings/time-slot-capacity': index31ebd148c98730e1059506f2a591a917,
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::update
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:74
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
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:74
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
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:74
 * @route '/admin/time-slot-capacities/{timeSlotCapacity}'
 */
update.put = (args: { timeSlotCapacity: number | { id: number } } | [timeSlotCapacity: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::updateCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:91
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
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:91
 * @route '/admin/time-slot-capacities/update'
 */
updateCapacity.url = (options?: RouteQueryOptions) => {
    return updateCapacity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimeSlotConfigurationController::updateCapacity
 * @see app/Http/Controllers/Admin/TimeSlotConfigurationController.php:91
 * @route '/admin/time-slot-capacities/update'
 */
updateCapacity.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCapacity.url(options),
    method: 'post',
})
const TimeSlotConfigurationController = { index, update, updateCapacity }

export default TimeSlotConfigurationController