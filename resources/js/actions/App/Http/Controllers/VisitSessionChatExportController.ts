import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VisitSessionChatExportController::store
 * @see app/Http/Controllers/VisitSessionChatExportController.php:18
 * @route '/visit/session/{session}/chat/export'
 */
export const store = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visit/session/{session}/chat/export',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::store
 * @see app/Http/Controllers/VisitSessionChatExportController.php:18
 * @route '/visit/session/{session}/chat/export'
 */
store.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return store.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::store
 * @see app/Http/Controllers/VisitSessionChatExportController.php:18
 * @route '/visit/session/{session}/chat/export'
 */
store.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::download
 * @see app/Http/Controllers/VisitSessionChatExportController.php:43
 * @route '/chat-exports/{chatExport}/download'
 */
export const download = (args: { chatExport: number | { id: number } } | [chatExport: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/chat-exports/{chatExport}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::download
 * @see app/Http/Controllers/VisitSessionChatExportController.php:43
 * @route '/chat-exports/{chatExport}/download'
 */
download.url = (args: { chatExport: number | { id: number } } | [chatExport: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chatExport: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { chatExport: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    chatExport: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chatExport: typeof args.chatExport === 'object'
                ? args.chatExport.id
                : args.chatExport,
                }

    return download.definition.url
            .replace('{chatExport}', parsedArgs.chatExport.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::download
 * @see app/Http/Controllers/VisitSessionChatExportController.php:43
 * @route '/chat-exports/{chatExport}/download'
 */
download.get = (args: { chatExport: number | { id: number } } | [chatExport: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VisitSessionChatExportController::download
 * @see app/Http/Controllers/VisitSessionChatExportController.php:43
 * @route '/chat-exports/{chatExport}/download'
 */
download.head = (args: { chatExport: number | { id: number } } | [chatExport: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})
const VisitSessionChatExportController = { store, download }

export default VisitSessionChatExportController