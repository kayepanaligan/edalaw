import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VideoRoomController::show
 * @see app/Http/Controllers/VideoRoomController.php:16
 * @route '/video-room'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/video-room',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VideoRoomController::show
 * @see app/Http/Controllers/VideoRoomController.php:16
 * @route '/video-room'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VideoRoomController::show
 * @see app/Http/Controllers/VideoRoomController.php:16
 * @route '/video-room'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VideoRoomController::show
 * @see app/Http/Controllers/VideoRoomController.php:16
 * @route '/video-room'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})
const VideoRoomController = { show }

export default VideoRoomController