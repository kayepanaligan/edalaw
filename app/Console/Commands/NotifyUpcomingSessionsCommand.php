<?php

namespace App\Console\Commands;

use App\Models\VisitSession;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Carbon\Carbon;

class NotifyUpcomingSessionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:notify-upcoming';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify jail officers 5 minutes before their scheduled sessions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔔 Checking for upcoming sessions...');
        
        $now = Carbon::now();
        $fiveMinutesFromNow = $now->copy()->addMinutes(5);
        
        // Find sessions starting in exactly 5 minutes
        $upcomingSessions = VisitSession::whereHas('jailOfficer')
            ->whereBetween('scheduled_start', [$now, $fiveMinutesFromNow])
            ->where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled')
            ->with(['jailOfficer', 'visit.user'])
            ->get();
        
        if ($upcomingSessions->isEmpty()) {
            $this->info('✅ No upcoming sessions found.');
            return Command::SUCCESS;
        }
        
        $this->info("📅 Found {$upcomingSessions->count()} upcoming session(s).");
        
        foreach ($upcomingSessions as $session) {
            $jailOfficer = $session->jailOfficer;
            
            if (!$jailOfficer || !$jailOfficer->contact_number) {
                $this->warn("⚠️ Skipping session #{$session->id}: Jail officer contact not available.");
                continue;
            }
            
            // Send SMS notification
            $message = "eDalawPlus Reminder: You have a scheduled session starting in 5 minutes.\n\n";
            $message .= "Time: {$session->scheduled_start->format('g:i A')}\n";
            
            if ($session->visit) {
                $visitorName = trim("{$session->visit->user->first_name} {$session->visit->user->last_name}");
                $inmateName = trim("{$session->visit->inmate_first_name} {$session->visit->inmate_last_name}");
                $message .= "Visitor: {$visitorName}\n";
                $message .= "Inmate: {$inmateName}\n";
            }
            
            $message .= "\nPlease be ready to monitor the session.";
            
            try {
                NotificationService::sendSms($jailOfficer, $message);
                
                $this->info("✅ Notified Officer {$jailOfficer->full_name} for session #{$session->id}");
                
                // Log the notification
                \App\Models\SystemLog::create([
                    'visit_session_id' => $session->id,
                    'action' => 'jail_officer_reminder_sent',
                    'performed_by' => null,
                    'metadata' => [
                        'jail_officer_id' => $jailOfficer->id,
                        'jail_officer_name' => $jailOfficer->full_name,
                        'minutes_until_start' => $now->diffInMinutes($session->scheduled_start),
                        'notification_method' => 'sms',
                    ],
                ]);
            } catch (\Exception $e) {
                $this->error("❌ Failed to notify for session #{$session->id}: {$e->getMessage()}");
            }
        }
        
        $this->info('✅ Notification process completed.');
        
        return Command::SUCCESS;
    }
}
