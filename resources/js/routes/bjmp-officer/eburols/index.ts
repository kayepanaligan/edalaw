import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import document from './document'
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/eburols',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:91
 * @route '/bjmp-officer/eburols/{eburol}/approve'
 */
export const approve = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/bjmp-officer/eburols/{eburol}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:91
 * @route '/bjmp-officer/eburols/{eburol}/approve'
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
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:91
 * @route '/bjmp-officer/eburols/{eburol}/approve'
 */
approve.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:162
 * @route '/bjmp-officer/eburols/{eburol}/reject'
 */
export const reject = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/bjmp-officer/eburols/{eburol}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:162
 * @route '/bjmp-officer/eburols/{eburol}/reject'
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
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:162
 * @route '/bjmp-officer/eburols/{eburol}/reject'
 */
reject.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:191
 * @route '/bjmp-officer/eburols/{eburol}/update-status'
 */
export const updateStatus = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/bjmp-officer/eburols/{eburol}/update-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:191
 * @route '/bjmp-officer/eburols/{eburol}/update-status'
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
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:191
 * @route '/bjmp-officer/eburols/{eburol}/update-status'
 */
updateStatus.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})
const eburols = {
    index: Object.assign(index, index),
document: Object.assign(document, document),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
updateStatus: Object.assign(updateStatus, updateStatus),
}

export default eburols