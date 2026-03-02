import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::index
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:24
 * @route '/bjmp-officer/appeals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/appeals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::index
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:24
 * @route '/bjmp-officer/appeals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::index
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:24
 * @route '/bjmp-officer/appeals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::index
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:24
 * @route '/bjmp-officer/appeals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::review
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:126
 * @route '/bjmp-officer/appeals/{appeal}/review'
 */
export const review = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/bjmp-officer/appeals/{appeal}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::review
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:126
 * @route '/bjmp-officer/appeals/{appeal}/review'
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
* @see \App\Http\Controllers\BjmpOfficer\AppealReviewController::review
 * @see app/Http/Controllers/BjmpOfficer/AppealReviewController.php:126
 * @route '/bjmp-officer/appeals/{appeal}/review'
 */
review.post = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})
const AppealReviewController = { index, review }

export default AppealReviewController