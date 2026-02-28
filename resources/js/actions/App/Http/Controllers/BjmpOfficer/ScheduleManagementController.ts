import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:24
 * @route '/bjmp-officer/schedules'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:24
 * @route '/bjmp-officer/schedules'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:24
 * @route '/bjmp-officer/schedules'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:24
 * @route '/bjmp-officer/schedules'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:89
 * @route '/bjmp-officer/schedules/{visit}/approve'
 */
export const approve = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/bjmp-officer/schedules/{visit}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:89
 * @route '/bjmp-officer/schedules/{visit}/approve'
 */
approve.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:89
 * @route '/bjmp-officer/schedules/{visit}/approve'
 */
approve.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:204
 * @route '/bjmp-officer/schedules/{visit}/reject'
 */
export const reject = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/bjmp-officer/schedules/{visit}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:204
 * @route '/bjmp-officer/schedules/{visit}/reject'
 */
reject.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:204
 * @route '/bjmp-officer/schedules/{visit}/reject'
 */
reject.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:233
 * @route '/bjmp-officer/schedules/{visit}/update-status'
 */
export const updateStatus = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/bjmp-officer/schedules/{visit}/update-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:233
 * @route '/bjmp-officer/schedules/{visit}/update-status'
 */
updateStatus.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:233
 * @route '/bjmp-officer/schedules/{visit}/update-status'
 */
updateStatus.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::generateAccessKey
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:319
 * @route '/bjmp-officer/schedules/{visit}/generate-access-key'
 */
export const generateAccessKey = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAccessKey.url(args, options),
    method: 'post',
})

generateAccessKey.definition = {
    methods: ["post"],
    url: '/bjmp-officer/schedules/{visit}/generate-access-key',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::generateAccessKey
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:319
 * @route '/bjmp-officer/schedules/{visit}/generate-access-key'
 */
generateAccessKey.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return generateAccessKey.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::generateAccessKey
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:319
 * @route '/bjmp-officer/schedules/{visit}/generate-access-key'
 */
generateAccessKey.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAccessKey.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::reschedule
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:346
 * @route '/bjmp-officer/schedules/{visit}/reschedule'
 */
export const reschedule = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})

reschedule.definition = {
    methods: ["post"],
    url: '/bjmp-officer/schedules/{visit}/reschedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::reschedule
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:346
 * @route '/bjmp-officer/schedules/{visit}/reschedule'
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
* @see \App\Http\Controllers\BjmpOfficer\ScheduleManagementController::reschedule
 * @see app/Http/Controllers/BjmpOfficer/ScheduleManagementController.php:346
 * @route '/bjmp-officer/schedules/{visit}/reschedule'
 */
reschedule.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})
const ScheduleManagementController = { index, approve, reject, updateStatus, generateAccessKey, reschedule }

export default ScheduleManagementController