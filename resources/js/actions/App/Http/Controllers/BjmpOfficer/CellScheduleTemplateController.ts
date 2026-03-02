import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::index
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:17
 * @route '/bjmp-officer/cell-schedules'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/cell-schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::index
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:17
 * @route '/bjmp-officer/cell-schedules'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::index
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:17
 * @route '/bjmp-officer/cell-schedules'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::index
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:17
 * @route '/bjmp-officer/cell-schedules'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::update
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:61
 * @route '/bjmp-officer/cell-schedules/{cell}'
 */
export const update = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/bjmp-officer/cell-schedules/{cell}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::update
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:61
 * @route '/bjmp-officer/cell-schedules/{cell}'
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
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::update
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:61
 * @route '/bjmp-officer/cell-schedules/{cell}'
 */
update.put = (args: { cell: number | { id: number } } | [cell: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::bulkUpdate
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:111
 * @route '/bjmp-officer/cell-schedules/bulk-update'
 */
export const bulkUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

bulkUpdate.definition = {
    methods: ["post"],
    url: '/bjmp-officer/cell-schedules/bulk-update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::bulkUpdate
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:111
 * @route '/bjmp-officer/cell-schedules/bulk-update'
 */
bulkUpdate.url = (options?: RouteQueryOptions) => {
    return bulkUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::bulkUpdate
 * @see app/Http/Controllers/BjmpOfficer/CellScheduleTemplateController.php:111
 * @route '/bjmp-officer/cell-schedules/bulk-update'
 */
bulkUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})
const CellScheduleTemplateController = { index, update, bulkUpdate }

export default CellScheduleTemplateController