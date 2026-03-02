import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::index
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:24
 * @route '/admin/schedules'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::index
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:24
 * @route '/admin/schedules'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::index
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:24
 * @route '/admin/schedules'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::index
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:24
 * @route '/admin/schedules'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::bookedSlots
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:108
 * @route '/admin/schedules/booked-slots'
 */
export const bookedSlots = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookedSlots.url(options),
    method: 'get',
})

bookedSlots.definition = {
    methods: ["get","head"],
    url: '/admin/schedules/booked-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::bookedSlots
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:108
 * @route '/admin/schedules/booked-slots'
 */
bookedSlots.url = (options?: RouteQueryOptions) => {
    return bookedSlots.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::bookedSlots
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:108
 * @route '/admin/schedules/booked-slots'
 */
bookedSlots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookedSlots.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::bookedSlots
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:108
 * @route '/admin/schedules/booked-slots'
 */
bookedSlots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bookedSlots.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::store
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:457
 * @route '/admin/schedules'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/schedules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::store
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:457
 * @route '/admin/schedules'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::store
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:457
 * @route '/admin/schedules'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::update
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:587
 * @route '/admin/schedules/{visit}'
 */
export const update = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/schedules/{visit}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::update
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:587
 * @route '/admin/schedules/{visit}'
 */
update.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::update
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:587
 * @route '/admin/schedules/{visit}'
 */
update.put = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::destroy
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:658
 * @route '/admin/schedules/{visit}'
 */
export const destroy = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/schedules/{visit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::destroy
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:658
 * @route '/admin/schedules/{visit}'
 */
destroy.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::destroy
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:658
 * @route '/admin/schedules/{visit}'
 */
destroy.delete = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::approve
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:170
 * @route '/admin/schedules/{visit}/approve'
 */
export const approve = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/schedules/{visit}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::approve
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:170
 * @route '/admin/schedules/{visit}/approve'
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
* @see \App\Http\Controllers\Admin\ScheduleManagementController::approve
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:170
 * @route '/admin/schedules/{visit}/approve'
 */
approve.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::reject
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:289
 * @route '/admin/schedules/{visit}/reject'
 */
export const reject = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/schedules/{visit}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::reject
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:289
 * @route '/admin/schedules/{visit}/reject'
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
* @see \App\Http\Controllers\Admin\ScheduleManagementController::reject
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:289
 * @route '/admin/schedules/{visit}/reject'
 */
reject.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::updateStatus
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:316
 * @route '/admin/schedules/{visit}/update-status'
 */
export const updateStatus = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/admin/schedules/{visit}/update-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::updateStatus
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:316
 * @route '/admin/schedules/{visit}/update-status'
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
* @see \App\Http\Controllers\Admin\ScheduleManagementController::updateStatus
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:316
 * @route '/admin/schedules/{visit}/update-status'
 */
updateStatus.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::generateAccessKey
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:430
 * @route '/admin/schedules/{visit}/generate-access-key'
 */
export const generateAccessKey = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAccessKey.url(args, options),
    method: 'post',
})

generateAccessKey.definition = {
    methods: ["post"],
    url: '/admin/schedules/{visit}/generate-access-key',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ScheduleManagementController::generateAccessKey
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:430
 * @route '/admin/schedules/{visit}/generate-access-key'
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
* @see \App\Http\Controllers\Admin\ScheduleManagementController::generateAccessKey
 * @see app/Http/Controllers/Admin/ScheduleManagementController.php:430
 * @route '/admin/schedules/{visit}/generate-access-key'
 */
generateAccessKey.post = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAccessKey.url(args, options),
    method: 'post',
})
const schedules = {
    index: Object.assign(index, index),
bookedSlots: Object.assign(bookedSlots, bookedSlots),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
updateStatus: Object.assign(updateStatus, updateStatus),
generateAccessKey: Object.assign(generateAccessKey, generateAccessKey),
}

export default schedules