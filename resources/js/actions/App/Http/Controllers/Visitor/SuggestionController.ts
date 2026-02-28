import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\SuggestionController::index
 * @see app/Http/Controllers/Visitor/SuggestionController.php:20
 * @route '/visitor/suggestions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/suggestions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\SuggestionController::index
 * @see app/Http/Controllers/Visitor/SuggestionController.php:20
 * @route '/visitor/suggestions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\SuggestionController::index
 * @see app/Http/Controllers/Visitor/SuggestionController.php:20
 * @route '/visitor/suggestions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\SuggestionController::index
 * @see app/Http/Controllers/Visitor/SuggestionController.php:20
 * @route '/visitor/suggestions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\SuggestionController::store
 * @see app/Http/Controllers/Visitor/SuggestionController.php:46
 * @route '/visitor/suggestions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visitor/suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\SuggestionController::store
 * @see app/Http/Controllers/Visitor/SuggestionController.php:46
 * @route '/visitor/suggestions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\SuggestionController::store
 * @see app/Http/Controllers/Visitor/SuggestionController.php:46
 * @route '/visitor/suggestions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const SuggestionController = { index, store }

export default SuggestionController