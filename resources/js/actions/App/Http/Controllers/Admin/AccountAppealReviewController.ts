import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::index
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:21
 * @route '/admin/account-appeals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/account-appeals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::index
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:21
 * @route '/admin/account-appeals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::index
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:21
 * @route '/admin/account-appeals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::index
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:21
 * @route '/admin/account-appeals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::review
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:67
 * @route '/admin/account-appeals/{appeal}/review'
 */
export const review = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/admin/account-appeals/{appeal}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::review
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:67
 * @route '/admin/account-appeals/{appeal}/review'
 */
review.url = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appeal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { appeal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    appeal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        appeal: typeof args.appeal === 'object'
                ? args.appeal.id
                : args.appeal,
                }

    return review.definition.url
            .replace('{appeal}', parsedArgs.appeal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AccountAppealReviewController::review
 * @see app/Http/Controllers/Admin/AccountAppealReviewController.php:67
 * @route '/admin/account-appeals/{appeal}/review'
 */
review.post = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})
const AccountAppealReviewController = { index, review }

export default AccountAppealReviewController