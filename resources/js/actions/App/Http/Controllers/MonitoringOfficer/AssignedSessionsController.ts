import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::startSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:97
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:97
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:97
 * @route '/monitoring-officer/assigned-sessions/{session}/start'
 */
startSession.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::endSession
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:130
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:130
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
 * @see app/Http/Controllers/MonitoringOfficer/AssignedSessionsController.php:130
 * @route '/monitoring-officer/assigned-sessions/{session}/end'
 */
endSession.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: endSession.url(args, options),
    method: 'post',
})
const AssignedSessionsController = { index, generateTunnel, startSession, endSession }

export default AssignedSessionsController