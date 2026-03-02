import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::index
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:26
 * @route '/admin/appeals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/appeals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::index
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:26
 * @route '/admin/appeals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::index
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:26
 * @route '/admin/appeals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::index
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:26
 * @route '/admin/appeals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::review
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:113
 * @route '/admin/appeals/{appeal}/review'
 */
export const review = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/admin/appeals/{appeal}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::review
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:113
 * @route '/admin/appeals/{appeal}/review'
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
* @see \App\Http\Controllers\Admin\AppealsOversightController::review
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:113
 * @route '/admin/appeals/{appeal}/review'
 */
review.post = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::updateStatus
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:160
 * @route '/admin/appeals/{appeal}/update-status'
 */
export const updateStatus = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus.url(args, options),
    method: 'put',
})

updateStatus.definition = {
    methods: ["put"],
    url: '/admin/appeals/{appeal}/update-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::updateStatus
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:160
 * @route '/admin/appeals/{appeal}/update-status'
 */
updateStatus.url = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{appeal}', parsedArgs.appeal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::updateStatus
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:160
 * @route '/admin/appeals/{appeal}/update-status'
 */
updateStatus.put = (args: { appeal: number | { id: number } } | [appeal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::downloadDocument
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
export const downloadDocument = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})

downloadDocument.definition = {
    methods: ["get","head"],
    url: '/admin/appeals/documents/{appealDocument}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::downloadDocument
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
downloadDocument.url = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appealDocument: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { appealDocument: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    appealDocument: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        appealDocument: typeof args.appealDocument === 'object'
                ? args.appealDocument.id
                : args.appealDocument,
                }

    return downloadDocument.definition.url
            .replace('{appealDocument}', parsedArgs.appealDocument.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::downloadDocument
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
downloadDocument.get = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::downloadDocument
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
downloadDocument.head = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadDocument.url(args, options),
    method: 'head',
})
const AppealsOversightController = { index, review, updateStatus, downloadDocument }

export default AppealsOversightController