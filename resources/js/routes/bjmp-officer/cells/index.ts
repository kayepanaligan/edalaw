import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:17
 * @route '/bjmp-officer/cells'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/cells',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:17
 * @route '/bjmp-officer/cells'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:17
 * @route '/bjmp-officer/cells'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:17
 * @route '/bjmp-officer/cells'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::store
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:47
 * @route '/bjmp-officer/cells'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/bjmp-officer/cells',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::store
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:47
 * @route '/bjmp-officer/cells'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::store
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:47
 * @route '/bjmp-officer/cells'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::update
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:66
 * @route '/bjmp-officer/cells/{cell}'
 */
export const update = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/bjmp-officer/cells/{cell}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::update
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:66
 * @route '/bjmp-officer/cells/{cell}'
 */
update.url = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cell: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cell: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cell: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cell: typeof args.cell === 'object'
                ? args.cell.id
                : args.cell,
                }

    return update.definition.url
            .replace('{cell}', parsedArgs.cell.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::update
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:66
 * @route '/bjmp-officer/cells/{cell}'
 */
update.put = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::destroy
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:87
 * @route '/bjmp-officer/cells/{cell}'
 */
export const destroy = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/bjmp-officer/cells/{cell}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::destroy
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:87
 * @route '/bjmp-officer/cells/{cell}'
 */
destroy.url = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cell: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cell: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cell: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cell: typeof args.cell === 'object'
                ? args.cell.id
                : args.cell,
                }

    return destroy.definition.url
            .replace('{cell}', parsedArgs.cell.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\CellManagementController::destroy
 * @see app/Http/Controllers/BjmpOfficer/CellManagementController.php:87
 * @route '/bjmp-officer/cells/{cell}'
 */
destroy.delete = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const cells = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default cells