import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:20
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:20
 * @route '/monitoring-officer/assigned-sessions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:20
 * @route '/monitoring-officer/assigned-sessions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::index
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:20
 * @route '/monitoring-officer/assigned-sessions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::generateTunnel
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:60
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:60
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:60
 * @route '/monitoring-officer/assigned-sessions/{session}/generate-tunnel'
 */
generateTunnel.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateTunnel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::start
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:97
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:97
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:97
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
start.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::end
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:130
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:130
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:130
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
end.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(args, options),
    method: 'post',
})
const assignedSessions = {
    index: Object.assign(index, index),
generateTunnel: Object.assign(generateTunnel, generateTunnel),
start: Object.assign(start, start),
end: Object.assign(end, end),
}

export default assignedSessions