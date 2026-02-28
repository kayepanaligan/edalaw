<?php

namespace App\Providers;

use App\Listeners\ClearAllSessionsOnLogout;
use App\Listeners\TrackUserSession;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Login::class => [
            TrackUserSession::class,
        ],
        Logout::class => [
            ClearAllSessionsOnLogout::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }
}
