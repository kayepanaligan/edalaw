import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/admin/visit-session/{session}/join'
 */
const joinf23da3dda64844e6ff056964333de8ca = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinf23da3dda64844e6ff056964333de8ca.url(args, options),
    method: 'get',
})

joinf23da3dda64844e6ff056964333de8ca.definition = {
    methods: ["get","head"],
    url: '/admin/visit-session/{session}/join',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/admin/visit-session/{session}/join'
 */
joinf23da3dda64844e6ff056964333de8ca.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinf23da3dda64844e6ff056964333de8ca.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/admin/visit-session/{session}/join'
 */
joinf23da3dda64844e6ff056964333de8ca.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinf23da3dda64844e6ff056964333de8ca.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/admin/visit-session/{session}/join'
 */
joinf23da3dda64844e6ff056964333de8ca.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: joinf23da3dda64844e6ff056964333de8ca.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
const joinec65a87a822b1ae0bf5329ac6044d78c = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinec65a87a822b1ae0bf5329ac6044d78c.url(args, options),
    method: 'get',
})

joinec65a87a822b1ae0bf5329ac6044d78c.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/visit-session/{session}/join',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
joinec65a87a822b1ae0bf5329ac6044d78c.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return joinec65a87a822b1ae0bf5329ac6044d78c.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
joinec65a87a822b1ae0bf5329ac6044d78c.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: joinec65a87a822b1ae0bf5329ac6044d78c.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
joinec65a87a822b1ae0bf5329ac6044d78c.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: joinec65a87a822b1ae0bf5329ac6044d78c.url(args, options),
    method: 'head',
})

export const join = {
    '/admin/visit-session/{session}/join': joinf23da3dda64844e6ff056964333de8ca,
    '/bjmp-officer/visit-session/{session}/join': joinec65a87a822b1ae0bf5329ac6044d78c,
}

const StaffVisitSessionJoinController = { join }

export default StaffVisitSessionJoinController