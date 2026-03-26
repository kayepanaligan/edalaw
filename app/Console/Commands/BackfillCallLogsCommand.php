<?php

namespace App\Console\Commands;

use App\Models\CallLog;
use App\Models\VisitSession;
use Illuminate\Console\Command;

class BackfillCallLogsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'call-logs:backfill {--dry-run}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backfill call logs for completed visit sessions that are missing call logs';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->info('Running in dry-run mode. No changes will be made.');
        }

        // Get all completed or missed visit sessions
        $sessions = VisitSession::with(['visit.user', 'eburol.user'])
            ->whereIn('status', ['completed', 'missed'])
            ->doesntHave('callLogs')
            ->get();

        $this->info("Found {$sessions->count()} sessions without call logs.");

        $created = 0;
        foreach ($sessions as $session) {
            $visitor = $session->visitor;
            if (!$visitor) {
                $this->warn("Session {$session->id}: No visitor found, skipping.");
                continue;
            }

            $callLogStatus = match($session->status) {
                'completed' => 'completed',
                'missed' => 'missed',
                default => 'failed',
            };

            if ($dryRun) {
                $this->info("Would create call log for session {$session->id}, visitor {$visitor->id}, status: {$callLogStatus}");
            } else {
                CallLog::create([
                    'user_id' => $visitor->id,
                    'visit_session_id' => $session->id,
                    'phone_number' => null,
                    'call_type' => 'video',
                    'call_date' => $session->ended_at ?? now(),
                    'duration' => $session->status === 'completed' ? $session->duration_seconds : null,
                    'notes' => $session->status === 'completed' 
                        ? 'Virtual visit completed' 
                        : 'Visit missed - participant did not join',
                    'status' => $callLogStatus,
                ]);
                $this->info("Created call log for session {$session->id}, visitor {$visitor->id}");
            }

            $created++;
        }

        if (!$dryRun) {
            $this->info("Successfully created {$created} call logs.");
        }

        return self::SUCCESS;
    }
}
