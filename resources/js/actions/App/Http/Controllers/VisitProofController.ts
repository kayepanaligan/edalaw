import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VisitProofController::show
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
export const show = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/visits/{visit}/proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VisitProofController::show
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
show.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { visit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { visit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    visit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        visit: typeof args.visit === 'object'
                ? args.visit.id
                : args.visit,
                }

    return show.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitProofController::show
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
show.get = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VisitProofController::show
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
show.head = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const VisitProofController = { show }

export default VisitProofController