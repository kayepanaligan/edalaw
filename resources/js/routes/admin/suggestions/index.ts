import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::index
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:20
 * @route '/admin/suggestions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/suggestions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::index
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:20
 * @route '/admin/suggestions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::index
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:20
 * @route '/admin/suggestions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::index
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:20
 * @route '/admin/suggestions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::update
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:58
 * @route '/admin/suggestions/{suggestion}'
 */
export const update = (args: { suggestion: number | { id: number } } | [suggestion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/suggestions/{suggestion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::update
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:58
 * @route '/admin/suggestions/{suggestion}'
 */
update.url = (args: { suggestion: number | { id: number } } | [suggestion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { suggestion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { suggestion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    suggestion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.id
                : args.suggestion,
                }

    return update.definition.url
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SuggestionManagementController::update
 * @see app/Http/Controllers/Admin/SuggestionManagementController.php:58
 * @route '/admin/suggestions/{suggestion}'
 */
update.put = (args: { suggestion: number | { id: number } } | [suggestion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
const suggestions = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
}

export default suggestions