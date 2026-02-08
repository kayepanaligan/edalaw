<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{sessionToken}', \App\Broadcasting\ChatChannel::class);

