import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:24
 * @route '/monitoring-officer/assigned-sessions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/assigned-sessions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:24
 * @route '/monitoring-officer/assigned-sessions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:24
 * @route '/monitoring-officer/assigned-sessions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:24
 * @route '/monitoring-officer/assigned-sessions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::generateTunnel
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:99
 * @route '/monitoring-officer/assigned-sessions/{session}/generate-tunnel'
 */
export const generateTunnel = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateTunnel.url(args, options),
    method: 'post',
})

generateTunnel.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/generate-tunnel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::generateTunnel
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:99
 * @route '/monitoring-officer/assigned-sessions/{session}/generate-tunnel'
 */
generateTunnel.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return generateTunnel.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::generateTunnel
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:99
 * @route '/monitoring-officer/assigned-sessions/{session}/generate-tunnel'
 */
generateTunnel.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateTunnel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::startSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:139
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
export const startSession = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startSession.url(args, options),
    method: 'post',
})

startSession.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::startSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:139
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
startSession.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return startSession.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::startSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:139
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
startSession.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::endSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:176
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
export const endSession = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: endSession.url(args, options),
    method: 'post',
})

endSession.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/end',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::endSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:176
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
endSession.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return endSession.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::endSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:176
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
endSession.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: endSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::lockChat
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:225
 * @route '/monitoring-officer/assigned-sessions/{session}/lock-chat'
 */
export const lockChat = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lockChat.url(args, options),
    method: 'post',
})

lockChat.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/lock-chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::lockChat
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:225
 * @route '/monitoring-officer/assigned-sessions/{session}/lock-chat'
 */
lockChat.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return lockChat.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::lockChat
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:225
 * @route '/monitoring-officer/assigned-sessions/{session}/lock-chat'
 */
lockChat.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lockChat.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::unlockChat
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:251
 * @route '/monitoring-officer/assigned-sessions/{session}/unlock-chat'
 */
export const unlockChat = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlockChat.url(args, options),
    method: 'post',
})

unlockChat.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/unlock-chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::unlockChat
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:251
 * @route '/monitoring-officer/assigned-sessions/{session}/unlock-chat'
 */
unlockChat.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return unlockChat.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::unlockChat
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:251
 * @route '/monitoring-officer/assigned-sessions/{session}/unlock-chat'
 */
unlockChat.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlockChat.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::joinAsObserver
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
export const joinAsObserver = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinAsObserver.url(args, options),
    method: 'get',
})

joinAsObserver.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/assigned-sessions/{session}/join',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::joinAsObserver
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
joinAsObserver.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinAsObserver.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::joinAsObserver
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
joinAsObserver.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinAsObserver.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::joinAsObserver
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
joinAsObserver.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: joinAsObserver.url(args, options),
    method: 'head',
})
const AssignedSessionsController = { index, generateTunnel, startSession, endSession, lockChat, unlockChat, joinAsObserver }

export default AssignedSessionsController