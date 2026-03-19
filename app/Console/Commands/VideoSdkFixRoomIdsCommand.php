<?php

namespace App\Console\Commands;

use App\Models\Visit;
use App\Models\VisitSession;
use App\Services\VideoSdkService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class VideoSdkFixRoomIdsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'videosdk:fix-room-ids
                            {--session=* : Visit session IDs to migrate (repeatable)}
                            {--visit=* : Visit IDs to migrate latest session for (repeatable)}
                            {--all : Migrate all visit_sessions}
                            {--dry-run : Show what would change without writing to DB}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create fresh VideoSDK v2 rooms and update stored room_id for existing visit sessions.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        /** @var VideoSdkService $videoSdk */
        $videoSdk = app(VideoSdkService::class);
        if (! $videoSdk->isV2Rooms()) {
            $this->error('This command is intended for VideoSDK v2 rooms. Set VIDEOSDK_API_ENDPOINT=https://api.videosdk.live/v2/rooms and retry.');

            return self::FAILURE;
        }

        $sessionIds = array_values(array_filter((array) $this->option('session')));
        $visitIds = array_values(array_filter((array) $this->option('visit')));
        $all = (bool) $this->option('all');
        $dryRun = (bool) $this->option('dry-run');

        if (! $all && $sessionIds === [] && $visitIds === []) {
            $this->error('Provide --session=ID, --visit=ID, or --all.');

            return self::FAILURE;
        }

        /** @var \Illuminate\Database\Eloquent\Collection<int, VisitSession> $sessions */
        $sessions = VisitSession::query()
            ->when($all, fn ($q) => $q)
            ->when(! $all && $sessionIds !== [], fn ($q) => $q->whereIn('id', $sessionIds))
            ->when(! $all && $visitIds !== [], function ($q) use ($visitIds) {
                $q->orWhereIn('visit_id', $visitIds);
            })
            ->orderByDesc('id')
            ->get();

        if ($sessions->isEmpty()) {
            $this->warn('No matching visit_sessions found.');

            return self::SUCCESS;
        }

        $this->info('Found '.$sessions->count().' visit_sessions to migrate.');
        if ($dryRun) {
            $this->warn('Dry-run mode: no database changes will be written.');
        }

        $rows = [];
        $updated = 0;
        $failed = 0;

        foreach ($sessions as $session) {
            $oldRoomId = $session->room_id;
            $roomName = "migrate-session-{$session->id}-".uniqid();

            $create = $videoSdk->createRoom($roomName);
            if (! ($create['success'] ?? false) || empty($create['room_id'])) {
                $failed++;
                $rows[] = [$session->id, $oldRoomId, '—', 'FAILED: '.($create['error'] ?? 'Unknown error')];

                continue;
            }

            $newRoomId = (string) $create['room_id'];

            if (! $dryRun) {
                DB::transaction(function () use ($session, $newRoomId) {
                    $session->update(['room_id' => $newRoomId]);

                    // Keep Visit.daily_co_room_id aligned where applicable (legacy field name, still used in app)
                    if ($session->visit_id) {
                        Visit::query()->whereKey($session->visit_id)->update(['daily_co_room_id' => $newRoomId]);
                    }
                });
            }

            $updated++;
            $rows[] = [$session->id, $oldRoomId, $newRoomId, $dryRun ? 'DRY-RUN' : 'UPDATED'];
        }

        $this->table(['session_id', 'old_room_id', 'new_room_id', 'result'], $rows);
        $this->info("Done. Updated: {$updated}, Failed: {$failed}.");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
