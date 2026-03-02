import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bjmp-officer/eburols',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::index
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:22
 * @route '/bjmp-officer/eburols'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

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

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:91
 * @route '/bjmp-officer/eburols/{eburol}/approve'
 */
export const approve = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/bjmp-officer/eburols/{eburol}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:91
 * @route '/bjmp-officer/eburols/{eburol}/approve'
 */
approve.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::approve
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:91
 * @route '/bjmp-officer/eburols/{eburol}/approve'
 */
approve.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:162
 * @route '/bjmp-officer/eburols/{eburol}/reject'
 */
export const reject = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/bjmp-officer/eburols/{eburol}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:162
 * @route '/bjmp-officer/eburols/{eburol}/reject'
 */
reject.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::reject
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:162
 * @route '/bjmp-officer/eburols/{eburol}/reject'
 */
reject.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:191
 * @route '/bjmp-officer/eburols/{eburol}/update-status'
 */
export const updateStatus = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/bjmp-officer/eburols/{eburol}/update-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:191
 * @route '/bjmp-officer/eburols/{eburol}/update-status'
 */
updateStatus.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BjmpOfficer\EburolManagementController::updateStatus
 * @see app/Http/Controllers/BjmpOfficer/EburolManagementController.php:191
 * @route '/bjmp-officer/eburols/{eburol}/update-status'
 */
updateStatus.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})
const EburolManagementController = { index, deathCertificate, relationshipProof, approve, reject, updateStatus }

export default EburolManagementController