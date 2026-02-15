<?php

namespace App\Console\Commands;

use App\Models\Visit;
use App\VisitStatus;
use Illuminate\Console\Command;

class ExpirePendingVisitsCommand extends Command
{
    protected $signature = 'visits:expire-pending';

    protected $description = 'Mark pending visits whose scheduled time has passed as rejected with a professional message.';

    public function handle(): int
    {
        $visits = Visit::where('status', VisitStatus::Pending)->get();
        $expired = 0;
        $message = 'This scheduled time has passed. Please submit a new visit schedule.';

        foreach ($visits as $visit) {
            if ($visit->isScheduleInPast()) {
                $visit->update([
                    'status' => VisitStatus::Rejected,
                    'rejection_reason' => $message,
                ]);
                $expired++;
            }
        }

        if ($expired > 0) {
            $this->info("Expired {$expired} pending visit(s).");
        }

        return self::SUCCESS;
    }
}
