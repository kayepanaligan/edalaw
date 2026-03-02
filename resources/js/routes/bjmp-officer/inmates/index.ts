import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:17
 * @route '/bjmp-officer/inmates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/inmates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:17
 * @route '/bjmp-officer/inmates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:17
 * @route '/bjmp-officer/inmates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:17
 * @route '/bjmp-officer/inmates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::store
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:59
 * @route '/bjmp-officer/inmates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/bjmp-officer/inmates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::store
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:59
 * @route '/bjmp-officer/inmates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::store
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:59
 * @route '/bjmp-officer/inmates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::update
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:85
 * @route '/bjmp-officer/inmates/{inmate}'
 */
export const update = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/bjmp-officer/inmates/{inmate}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::update
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:85
 * @route '/bjmp-officer/inmates/{inmate}'
 */
update.url = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inmate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inmate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inmate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inmate: typeof args.inmate === 'object'
                ? args.inmate.id
                : args.inmate,
                }

    return update.definition.url
            .replace('{inmate}', parsedArgs.inmate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::update
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:85
 * @route '/bjmp-officer/inmates/{inmate}'
 */
update.put = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::destroy
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:113
 * @route '/bjmp-officer/inmates/{inmate}'
 */
export const destroy = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/bjmp-officer/inmates/{inmate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::destroy
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:113
 * @route '/bjmp-officer/inmates/{inmate}'
 */
destroy.url = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inmate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inmate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inmate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inmate: typeof args.inmate === 'object'
                ? args.inmate.id
                : args.inmate,
                }

    return destroy.definition.url
            .replace('{inmate}', parsedArgs.inmate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::destroy
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:113
 * @route '/bjmp-officer/inmates/{inmate}'
 */
destroy.delete = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::transfer
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:123
 * @route '/bjmp-officer/inmates/{inmate}/transfer'
 */
export const transfer = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transfer.url(args, options),
    method: 'post',
})

transfer.definition = {
    methods: ["post"],
    url: '/bjmp-officer/inmates/{inmate}/transfer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::transfer
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:123
 * @route '/bjmp-officer/inmates/{inmate}/transfer'
 */
transfer.url = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inmate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inmate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inmate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inmate: typeof args.inmate === 'object'
                ? args.inmate.id
                : args.inmate,
                }

    return transfer.definition.url
            .replace('{inmate}', parsedArgs.inmate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\InmateManagementController::transfer
 * @see app/Http/Controllers/BjmpOfficer/InmateManagementController.php:123
 * @route '/bjmp-officer/inmates/{inmate}/transfer'
 */
transfer.post = (args: { inmate: number | { id: number } } | [inmate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transfer.url(args, options),
    method: 'post',
})
const inmates = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
transfer: Object.assign(transfer, transfer),
}

export default inmates