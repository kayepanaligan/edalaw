import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Webhook\DailyCoWebhookController::handle
 * @see app/Http/Controllers/Webhook/DailyCoWebhookController.php:22
 * @route '/webhooks/daily-co'
 */
export const handle = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(options),
    method: 'post',
})

handle.definition = {
    methods: ["post"],
    url: '/webhooks/daily-co',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Webhook\DailyCoWebhookController::handle
 * @see app/Http/Controllers/Webhook/DailyCoWebhookController.php:22
 * @route '/webhooks/daily-co'
 */
handle.url = (options?: RouteQueryOptions) => {
    return handle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Webhook\DailyCoWebhookController::handle
 * @see app/Http/Controllers/Webhook/DailyCoWebhookController.php:22
 * @route '/webhooks/daily-co'
 */
handle.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(options),
    method: 'post',
})
const DailyCoWebhookController = { handle }

export default DailyCoWebhookController