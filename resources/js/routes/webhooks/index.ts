import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Webhook\DailyCoWebhookController::dailyCo
 * @see app/Http/Controllers/Webhook/DailyCoWebhookController.php:22
 * @route '/webhooks/daily-co'
 */
export const dailyCo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dailyCo.url(options),
    method: 'post',
})

dailyCo.definition = {
    methods: ["post"],
    url: '/webhooks/daily-co',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Webhook\DailyCoWebhookController::dailyCo
 * @see app/Http/Controllers/Webhook/DailyCoWebhookController.php:22
 * @route '/webhooks/daily-co'
 */
dailyCo.url = (options?: RouteQueryOptions) => {
    return dailyCo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Webhook\DailyCoWebhookController::dailyCo
 * @see app/Http/Controllers/Webhook/DailyCoWebhookController.php:22
 * @route '/webhooks/daily-co'
 */
dailyCo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dailyCo.url(options),
    method: 'post',
})
const webhooks = {
    dailyCo: Object.assign(dailyCo, dailyCo),
}

export default webhooks