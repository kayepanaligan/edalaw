import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::show
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:18
 * @route '/visit/session/{session}'
 */
export const show = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/visit/session/{session}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::show
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:18
 * @route '/visit/session/{session}'
 */
show.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::show
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:18
 * @route '/visit/session/{session}'
 */
show.get = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::show
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:18
 * @route '/visit/session/{session}'
 */
show.head = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::acceptTerms
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:60
 * @route '/visit/session/{session}/accept-terms'
 */
export const acceptTerms = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptTerms.url(args, options),
    method: 'post',
})

acceptTerms.definition = {
    methods: ["post"],
    url: '/visit/session/{session}/accept-terms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::acceptTerms
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:60
 * @route '/visit/session/{session}/accept-terms'
 */
acceptTerms.url = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return acceptTerms.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\VisitSessionController::acceptTerms
 * @see app/Http/Controllers/Visitor/VisitSessionController.php:60
 * @route '/visit/session/{session}/accept-terms'
 */
acceptTerms.post = (args: { session: number | { id: number } } | [session: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptTerms.url(args, options),
    method: 'post',
})
const visitSession = {
    show: Object.assign(show, show),
acceptTerms: Object.assign(acceptTerms, acceptTerms),
}

export default visitSession