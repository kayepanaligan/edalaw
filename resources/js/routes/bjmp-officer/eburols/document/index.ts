import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::deathCertificate
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:256
 * @route '/bjmp-officer/eburols/{eburol}/document/death-certificate'
 */
export const deathCertificate = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deathCertificate.url(args, options),
    method: 'get',
})

deathCertificate.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/eburols/{eburol}/document/death-certificate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::deathCertificate
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:256
 * @route '/bjmp-officer/eburols/{eburol}/document/death-certificate'
 */
deathCertificate.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return deathCertificate.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::deathCertificate
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:256
 * @route '/bjmp-officer/eburols/{eburol}/document/death-certificate'
 */
deathCertificate.get = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deathCertificate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::deathCertificate
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:256
 * @route '/bjmp-officer/eburols/{eburol}/document/death-certificate'
 */
deathCertificate.head = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: deathCertificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::relationshipProof
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:270
 * @route '/bjmp-officer/eburols/{eburol}/document/relationship-proof'
 */
export const relationshipProof = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: relationshipProof.url(args, options),
    method: 'get',
})

relationshipProof.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/eburols/{eburol}/document/relationship-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::relationshipProof
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:270
 * @route '/bjmp-officer/eburols/{eburol}/document/relationship-proof'
 */
relationshipProof.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { eburol: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { eburol: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    eburol: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        eburol: typeof args.eburol === 'object'
                ? args.eburol.id
                : args.eburol,
                }

    return relationshipProof.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::relationshipProof
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:270
 * @route '/bjmp-officer/eburols/{eburol}/document/relationship-proof'
 */
relationshipProof.get = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: relationshipProof.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::relationshipProof
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:270
 * @route '/bjmp-officer/eburols/{eburol}/document/relationship-proof'
 */
relationshipProof.head = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: relationshipProof.url(args, options),
    method: 'head',
})
const document = {
    deathCertificate: Object.assign(deathCertificate, deathCertificate),
relationshipProof: Object.assign(relationshipProof, relationshipProof),
}

export default document