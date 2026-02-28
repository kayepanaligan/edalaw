import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\AppealController::index
 * @see app/Http/Controllers/Visitor/AppealController.php:27
 * @route '/visitor/appeals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/appeals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\AppealController::index
 * @see app/Http/Controllers/Visitor/AppealController.php:27
 * @route '/visitor/appeals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\AppealController::index
 * @see app/Http/Controllers/Visitor/AppealController.php:27
 * @route '/visitor/appeals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\AppealController::index
 * @see app/Http/Controllers/Visitor/AppealController.php:27
 * @route '/visitor/appeals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\AppealController::store
 * @see app/Http/Controllers/Visitor/AppealController.php:145
 * @route '/visitor/appeals'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visitor/appeals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\AppealController::store
 * @see app/Http/Controllers/Visitor/AppealController.php:145
 * @route '/visitor/appeals'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\AppealController::store
 * @see app/Http/Controllers/Visitor/AppealController.php:145
 * @route '/visitor/appeals'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const appeals = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default appeals