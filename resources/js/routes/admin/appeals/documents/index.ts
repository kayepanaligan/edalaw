import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::download
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
export const download = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/admin/appeals/documents/{appealDocument}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::download
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
download.url = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return download.definition.url
            .replace('{appealDocument}', parsedArgs.appealDocument.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::download
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
download.get = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AppealsOversightController::download
 * @see app/Http/Controllers/Admin/AppealsOversightController.php:237
 * @route '/admin/appeals/documents/{appealDocument}/download'
 */
download.head = (args: { appealDocument: number | { id: number } } | [appealDocument: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})
const documents = {
    download: Object.assign(download, download),
}

export default documents