import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VisitSessionChatController::index
 * @see app/Http/Controllers/VisitSessionChatController.php:21
 * @route '/visit/session/{session}/chat'
 */
export const index = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visit/session/{session}/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VisitSessionChatController::index
 * @see app/Http/Controllers/VisitSessionChatController.php:21
 * @route '/visit/session/{session}/chat'
 */
index.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitSessionChatController::index
 * @see app/Http/Controllers/VisitSessionChatController.php:21
 * @route '/visit/session/{session}/chat'
 */
index.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VisitSessionChatController::index
 * @see app/Http/Controllers/VisitSessionChatController.php:21
 * @route '/visit/session/{session}/chat'
 */
index.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VisitSessionChatController::store
 * @see app/Http/Controllers/VisitSessionChatController.php:55
 * @route '/visit/session/{session}/chat'
 */
export const store = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visit/session/{session}/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VisitSessionChatController::store
 * @see app/Http/Controllers/VisitSessionChatController.php:55
 * @route '/visit/session/{session}/chat'
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
* @see \App\Http\Controllers\VisitSessionChatController::store
 * @see app/Http/Controllers/VisitSessionChatController.php:55
 * @route '/visit/session/{session}/chat'
 */
store.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VisitSessionChatController::flag
 * @see app/Http/Controllers/VisitSessionChatController.php:122
 * @route '/visit/session/{session}/chat/{chatLog}/flag'
 */
export const flag = (args: { session: number | { id: number }, chatLog: number | { id: number } } | [session: number | { id: number }, chatLog: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

flag.definition = {
    methods: ["post"],
    url: '/visit/session/{session}/chat/{chatLog}/flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VisitSessionChatController::flag
 * @see app/Http/Controllers/VisitSessionChatController.php:122
 * @route '/visit/session/{session}/chat/{chatLog}/flag'
 */
flag.url = (args: { session: number | { id: number }, chatLog: number | { id: number } } | [session: number | { id: number }, chatLog: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                    chatLog: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                                chatLog: typeof args.chatLog === 'object'
                ? args.chatLog.id
                : args.chatLog,
                }

    return flag.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace('{chatLog}', parsedArgs.chatLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitSessionChatController::flag
 * @see app/Http/Controllers/VisitSessionChatController.php:122
 * @route '/visit/session/{session}/chat/{chatLog}/flag'
 */
flag.post = (args: { session: number | { id: number }, chatLog: number | { id: number } } | [session: number | { id: number }, chatLog: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flag.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::exportMethod
 * @see app/Http/Controllers/VisitSessionChatExportController.php:18
 * @route '/visit/session/{session}/chat/export'
 */
export const exportMethod = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(args, options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/visit/session/{session}/chat/export',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::exportMethod
 * @see app/Http/Controllers/VisitSessionChatExportController.php:18
 * @route '/visit/session/{session}/chat/export'
 */
exportMethod.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitSessionChatExportController::exportMethod
 * @see app/Http/Controllers/VisitSessionChatExportController.php:18
 * @route '/visit/session/{session}/chat/export'
 */
exportMethod.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(args, options),
    method: 'post',
})
const chat = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
flag: Object.assign(flag, flag),
export: Object.assign(exportMethod, exportMethod),
}

export default chat