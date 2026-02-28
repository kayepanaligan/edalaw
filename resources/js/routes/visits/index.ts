import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\VisitProofController::proof
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
export const proof = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proof.url(args, options),
    method: 'get',
})

proof.definition = {
    methods: ["get","head"],
    url: '/visits/{visit}/proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VisitProofController::proof
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
proof.url = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return proof.definition.url
            .replace('{visit}', parsedArgs.visit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VisitProofController::proof
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
proof.get = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proof.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VisitProofController::proof
 * @see app/Http/Controllers/VisitProofController.php:18
 * @route '/visits/{visit}/proof'
 */
proof.head = (args: { visit: number | { id: number } } | [visit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proof.url(args, options),
    method: 'head',
})
const visits = {
    proof: Object.assign(proof, proof),
}

export default visits