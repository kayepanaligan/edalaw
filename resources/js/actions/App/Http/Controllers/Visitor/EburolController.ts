import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Visitor\EburolController::index
 * @see app/Http/Controllers/Visitor/EburolController.php:26
 * @route '/visitor/eburol'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/visitor/eburol',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::index
 * @see app/Http/Controllers/Visitor/EburolController.php:26
 * @route '/visitor/eburol'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::index
 * @see app/Http/Controllers/Visitor/EburolController.php:26
 * @route '/visitor/eburol'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\EburolController::index
 * @see app/Http/Controllers/Visitor/EburolController.php:26
 * @route '/visitor/eburol'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::slotAvailability
 * @see app/Http/Controllers/Visitor/EburolController.php:118
 * @route '/visitor/eburol/slot-availability'
 */
export const slotAvailability = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slotAvailability.url(options),
    method: 'get',
})

slotAvailability.definition = {
    methods: ["get","head"],
    url: '/visitor/eburol/slot-availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::slotAvailability
 * @see app/Http/Controllers/Visitor/EburolController.php:118
 * @route '/visitor/eburol/slot-availability'
 */
slotAvailability.url = (options?: RouteQueryOptions) => {
    return slotAvailability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::slotAvailability
 * @see app/Http/Controllers/Visitor/EburolController.php:118
 * @route '/visitor/eburol/slot-availability'
 */
slotAvailability.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slotAvailability.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\EburolController::slotAvailability
 * @see app/Http/Controllers/Visitor/EburolController.php:118
 * @route '/visitor/eburol/slot-availability'
 */
slotAvailability.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: slotAvailability.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::store
 * @see app/Http/Controllers/Visitor/EburolController.php:150
 * @route '/visitor/eburol'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/visitor/eburol',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::store
 * @see app/Http/Controllers/Visitor/EburolController.php:150
 * @route '/visitor/eburol'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::store
 * @see app/Http/Controllers/Visitor/EburolController.php:150
 * @route '/visitor/eburol'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::show
 * @see app/Http/Controllers/Visitor/EburolController.php:246
 * @route '/visitor/eburol/{eburol}'
 */
export const show = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/visitor/eburol/{eburol}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::show
 * @see app/Http/Controllers/Visitor/EburolController.php:246
 * @route '/visitor/eburol/{eburol}'
 */
show.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::show
 * @see app/Http/Controllers/Visitor/EburolController.php:246
 * @route '/visitor/eburol/{eburol}'
 */
show.get = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\EburolController::show
 * @see app/Http/Controllers/Visitor/EburolController.php:246
 * @route '/visitor/eburol/{eburol}'
 */
show.head = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::deathCertificate
 * @see app/Http/Controllers/Visitor/EburolController.php:488
 * @route '/visitor/eburol/{eburol}/document/death-certificate'
 */
export const deathCertificate = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deathCertificate.url(args, options),
    method: 'get',
})

deathCertificate.definition = {
    methods: ["get","head"],
    url: '/visitor/eburol/{eburol}/document/death-certificate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::deathCertificate
 * @see app/Http/Controllers/Visitor/EburolController.php:488
 * @route '/visitor/eburol/{eburol}/document/death-certificate'
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
* @see \App\Http\Controllers\Visitor\EburolController::deathCertificate
 * @see app/Http/Controllers/Visitor/EburolController.php:488
 * @route '/visitor/eburol/{eburol}/document/death-certificate'
 */
deathCertificate.get = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deathCertificate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\EburolController::deathCertificate
 * @see app/Http/Controllers/Visitor/EburolController.php:488
 * @route '/visitor/eburol/{eburol}/document/death-certificate'
 */
deathCertificate.head = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: deathCertificate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::relationshipProof
 * @see app/Http/Controllers/Visitor/EburolController.php:505
 * @route '/visitor/eburol/{eburol}/document/relationship-proof'
 */
export const relationshipProof = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: relationshipProof.url(args, options),
    method: 'get',
})

relationshipProof.definition = {
    methods: ["get","head"],
    url: '/visitor/eburol/{eburol}/document/relationship-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::relationshipProof
 * @see app/Http/Controllers/Visitor/EburolController.php:505
 * @route '/visitor/eburol/{eburol}/document/relationship-proof'
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
* @see \App\Http\Controllers\Visitor\EburolController::relationshipProof
 * @see app/Http/Controllers/Visitor/EburolController.php:505
 * @route '/visitor/eburol/{eburol}/document/relationship-proof'
 */
relationshipProof.get = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: relationshipProof.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Visitor\EburolController::relationshipProof
 * @see app/Http/Controllers/Visitor/EburolController.php:505
 * @route '/visitor/eburol/{eburol}/document/relationship-proof'
 */
relationshipProof.head = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: relationshipProof.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::update
 * @see app/Http/Controllers/Visitor/EburolController.php:283
 * @route '/visitor/eburol/{eburol}'
 */
export const update = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/visitor/eburol/{eburol}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::update
 * @see app/Http/Controllers/Visitor/EburolController.php:283
 * @route '/visitor/eburol/{eburol}'
 */
update.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::update
 * @see app/Http/Controllers/Visitor/EburolController.php:283
 * @route '/visitor/eburol/{eburol}'
 */
update.put = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::reschedule
 * @see app/Http/Controllers/Visitor/EburolController.php:375
 * @route '/visitor/eburol/{eburol}/reschedule'
 */
export const reschedule = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})

reschedule.definition = {
    methods: ["post"],
    url: '/visitor/eburol/{eburol}/reschedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::reschedule
 * @see app/Http/Controllers/Visitor/EburolController.php:375
 * @route '/visitor/eburol/{eburol}/reschedule'
 */
reschedule.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reschedule.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::reschedule
 * @see app/Http/Controllers/Visitor/EburolController.php:375
 * @route '/visitor/eburol/{eburol}/reschedule'
 */
reschedule.post = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reschedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Visitor\EburolController::destroy
 * @see app/Http/Controllers/Visitor/EburolController.php:434
 * @route '/visitor/eburol/{eburol}'
 */
export const destroy = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/visitor/eburol/{eburol}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Visitor\EburolController::destroy
 * @see app/Http/Controllers/Visitor/EburolController.php:434
 * @route '/visitor/eburol/{eburol}'
 */
destroy.url = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{eburol}', parsedArgs.eburol.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Visitor\EburolController::destroy
 * @see app/Http/Controllers/Visitor/EburolController.php:434
 * @route '/visitor/eburol/{eburol}'
 */
destroy.delete = (args: { eburol: number | { id: number } } | [eburol: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const EburolController = { index, slotAvailability, store, show, deathCertificate, relationshipProof, update, reschedule, destroy }

export default EburolController