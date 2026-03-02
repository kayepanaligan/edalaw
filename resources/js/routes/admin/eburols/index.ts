import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import document from './document'
/**
* @see \App\Http\Controllers\Admin\EburolManagementController::index
 * @see app/Http/Controllers/Admin/EburolManagementController.php:24
 * @route '/admin/eburols'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/eburols',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::index
 * @see app/Http/Controllers/Admin/EburolManagementController.php:24
 * @route '/admin/eburols'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::index
 * @see app/Http/Controllers/Admin/EburolManagementController.php:24
 * @route '/admin/eburols'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EburolManagementController::index
 * @see app/Http/Controllers/Admin/EburolManagementController.php:24
 * @route '/admin/eburols'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::store
 * @see app/Http/Controllers/Admin/EburolManagementController.php:118
 * @route '/admin/eburols'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/eburols',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::store
 * @see app/Http/Controllers/Admin/EburolManagementController.php:118
 * @route '/admin/eburols'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::store
 * @see app/Http/Controllers/Admin/EburolManagementController.php:118
 * @route '/admin/eburols'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::update
 * @see app/Http/Controllers/Admin/EburolManagementController.php:202
 * @route '/admin/eburols/{eburol}'
 */
export const update = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/eburols/{eburol}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::update
 * @see app/Http/Controllers/Admin/EburolManagementController.php:202
 * @route '/admin/eburols/{eburol}'
 */
update.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return update.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::update
 * @see app/Http/Controllers/Admin/EburolManagementController.php:202
 * @route '/admin/eburols/{eburol}'
 */
update.put = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::destroy
 * @see app/Http/Controllers/Admin/EburolManagementController.php:289
 * @route '/admin/eburols/{eburol}'
 */
export const destroy = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/eburols/{eburol}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::destroy
 * @see app/Http/Controllers/Admin/EburolManagementController.php:289
 * @route '/admin/eburols/{eburol}'
 */
destroy.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return destroy.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::destroy
 * @see app/Http/Controllers/Admin/EburolManagementController.php:289
 * @route '/admin/eburols/{eburol}'
 */
destroy.delete = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::approve
 * @see app/Http/Controllers/Admin/EburolManagementController.php:344
 * @route '/admin/eburols/{eburol}/approve'
 */
export const approve = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/eburols/{eburol}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::approve
 * @see app/Http/Controllers/Admin/EburolManagementController.php:344
 * @route '/admin/eburols/{eburol}/approve'
 */
approve.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return approve.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::approve
 * @see app/Http/Controllers/Admin/EburolManagementController.php:344
 * @route '/admin/eburols/{eburol}/approve'
 */
approve.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::reject
 * @see app/Http/Controllers/Admin/EburolManagementController.php:422
 * @route '/admin/eburols/{eburol}/reject'
 */
export const reject = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/eburols/{eburol}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::reject
 * @see app/Http/Controllers/Admin/EburolManagementController.php:422
 * @route '/admin/eburols/{eburol}/reject'
 */
reject.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return reject.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::reject
 * @see app/Http/Controllers/Admin/EburolManagementController.php:422
 * @route '/admin/eburols/{eburol}/reject'
 */
reject.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::updateStatus
 * @see app/Http/Controllers/Admin/EburolManagementController.php:451
 * @route '/admin/eburols/{eburol}/update-status'
 */
export const updateStatus = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/admin/eburols/{eburol}/update-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::updateStatus
 * @see app/Http/Controllers/Admin/EburolManagementController.php:451
 * @route '/admin/eburols/{eburol}/update-status'
 */
updateStatus.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return updateStatus.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EburolManagementController::updateStatus
 * @see app/Http/Controllers/Admin/EburolManagementController.php:451
 * @route '/admin/eburols/{eburol}/update-status'
 */
updateStatus.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})
const eburols = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
updateStatus: Object.assign(updateStatus, updateStatus),
document: Object.assign(document, document),
}

export default eburols