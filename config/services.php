<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'daily_co' => [
        'api_key' => env('DAILY_CO_API_KEY'),
        'api_url' => env('DAILY_CO_API_URL', 'https://api.daily.co/v1'),
        'webhook_secret' => env('DAILY_CO_WEBHOOK_SECRET'),
    ],

    'semaphore' => [
        'api_key' => env('SEMAPHORE_API_KEY'),
        'sender_name' => env('SEMAPHORE_SENDER_NAME'),
    ],

    'videosdk' => [
        'api_key' => env('VIDEOSDK_API_KEY'),
        'secret_key' => env('VIDEOSDK_SECRET_KEY'),
        // v2 rooms: https://api.videosdk.live/v2/rooms — token and init-config use opaque roomId.
        'api_endpoint' => env('VIDEOSDK_API_ENDPOINT', 'https://api.videosdk.live/v1/meetings'),
        'token' => env('VIDEOSDK_TOKEN'),
        // After changing .env run: php artisan config:clear
    ],

];
