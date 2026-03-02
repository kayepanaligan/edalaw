import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
export const join = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})

join.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/visit-session/{session}/join',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
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
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
join.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: join.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StaffVisitSessionJoinController::join
 * @see app/Http/Controllers/StaffVisitSessionJoinController.php:15
 * @route '/bjmp-officer/visit-session/{session}/join'
 */
join.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: join.url(args, options),
    method: 'head',
})
const visitSession = {
    join: Object.assign(join, join),
}

export default visitSession