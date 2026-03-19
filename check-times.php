<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$cap = App\Models\TimeSlotCapacity::where('visit_type', 'virtual')->first();
echo "Virtual start_time: " . ($cap->start_time?->format('H:i') ?? 'null') . PHP_EOL;
echo "Virtual end_time: " . ($cap->end_time?->format('H:i') ?? 'null') . PHP_EOL;

$cap2 = App\Models\TimeSlotCapacity::where('visit_type', 'physical')->first();
echo "Physical start_time: " . ($cap2->start_time?->format('H:i') ?? 'null') . PHP_EOL;
echo "Physical end_time: " . ($cap2->end_time?->format('H:i') ?? 'null') . PHP_EOL;
