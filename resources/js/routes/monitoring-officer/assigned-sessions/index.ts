import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::start
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:139
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
export const start = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::start
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:139
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
start.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::start
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:139
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
start.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::end
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:176
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
export const end = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(args, options),
    method: 'post',
})

end.definition = {
    methods: ["post"],
    url: '/monitoring-officer/assigned-sessions/{session}/end',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::end
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:176
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
end.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return end.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::end
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:176
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
end.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(args, options),
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
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::join
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
export const join = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})

join.definition = {
    methods: ["get","head"],
    url: '/monitoring-officer/assigned-sessions/{session}/join',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::join
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
join.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return join.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::join
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
join.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::join
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:278
 * @route '/monitoring-officer/assigned-sessions/{session}/join'
 */
join.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: join.url(args, options),
    method: 'head',
})
const assignedSessions = {
    index: Object.assign(index, index),
generateTunnel: Object.assign(generateTunnel, generateTunnel),
start: Object.assign(start, start),
end: Object.assign(end, end),
lockChat: Object.assign(lockChat, lockChat),
unlockChat: Object.assign(unlockChat, unlockChat),
join: Object.assign(join, join),
}

export default assignedSessions