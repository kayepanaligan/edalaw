import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\AccountAppealController::store
 * @see app/Http/Controllers/Auth/AccountAppealController.php:21
 * @route '/account-appeal'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/account-appeal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\AccountAppealController::store
 * @see app/Http/Controllers/Auth/AccountAppealController.php:21
 * @route '/account-appeal'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AccountAppealController::store
 * @see app/Http/Controllers/Auth/AccountAppealController.php:21
 * @route '/account-appeal'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const accountAppeal = {
    store: Object.assign(store, store),
}

export default accountAppeal