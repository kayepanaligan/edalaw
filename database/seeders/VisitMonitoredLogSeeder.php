<?php

namespace Database\Seeders;

use App\Models\VisitMonitoredLog;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Database\Seeder;

class VisitMonitoredLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get jail officers and visitors
        $jailOfficers = User::whereHas('role', fn($q) => $q->where('slug', 'jail_officer'))->get();
        $visitors = User::whereHas('role', fn($q) => $q->where('slug', 'visitor'))->limit(10)->get();
        
        if ($jailOfficers->isEmpty() || $visitors->isEmpty()) {
            $this->command->info('No jail officers or visitors found. Skipping seeder.');
            return;
        }

        $visitTypes = ['virtual', 'physical'];
        $statuses = ['completed', 'interrupted', 'failed'];
        
        // Create 20 sample monitored logs
        for ($i = 0; $i < 20; $i++) {
            $visitor = $visitors->random();
            $jailOfficer = $jailOfficers->random();
            $visitType = $visitTypes[array_rand($visitTypes)];
            $status = $statuses[array_rand($statuses)];
            
            $startTime = now()->subDays(rand(0, 30))->subHours(rand(1, 8));
            $durationSeconds = rand(300, 7200); // 5 minutes to 2 hours
            $endTime = $startTime->copy()->addSeconds($durationSeconds);
            
            $participants = [
                [
                    'id' => "participant_{$i}_1",
                    'name' => $visitor->first_name . ' ' . $visitor->last_name,
                    'role' => 'visitor',
                    'joined_at' => $startTime->copy()->addSeconds(rand(0, 60))->toIso8601String(),
                    'left_at' => $endTime->copy()->subSeconds(rand(0, 60))->toIso8601String(),
                    'duration_seconds' => $durationSeconds - rand(0, 120),
                ],
                [
                    'id' => "participant_{$i}_2",
                    'name' => $jailOfficer->first_name . ' ' . $jailOfficer->last_name,
                    'role' => 'jail_officer',
                    'joined_at' => $startTime->copy()->addSeconds(rand(0, 30))->toIso8601String(),
                    'left_at' => $endTime->toIso8601String(),
                    'duration_seconds' => $durationSeconds - rand(0, 30),
                ],
            ];
            
            VisitMonitoredLog::create([
                'visit_id' => null, // Can be linked to actual visit if exists
                'meeting_id' => 'MEET-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'room_id' => 'ROOM-' . strtoupper(substr(md5(uniqid()), 0, 6)),
                'jail_officer_id' => $jailOfficer->id,
                'visitor_id' => $visitor->id,
                'visitor_name' => trim("{$visitor->first_name} {$visitor->last_name}"),
                'inmate_name' => "Inmate " . chr(65 + $i), // Inmate A, B, C...
                'visit_type' => $visitType,
                'session_started_at' => $startTime,
                'session_ended_at' => $endTime,
                'duration_seconds' => $durationSeconds,
                'unique_participants_count' => count($participants),
                'participants' => $participants,
                'session_stats' => [
                    'chat_messages' => rand(10, 100),
                    'average_quality' => rand(70, 100),
                    'connection_drops' => $status === 'failed' ? rand(1, 5) : 0,
                ],
                'traces' => $status === 'completed' ? [] : [
                    [
                        'timestamp' => $startTime->copy()->addMinutes(rand(1, 10))->toIso8601String(),
                        'event' => 'Connection established',
                        'details' => 'Participant joined successfully',
                    ],
                ],
                'errors' => $status === 'failed' ? [
                    [
                        'timestamp' => $endTime->toIso8601String(),
                        'type' => 'connection_lost',
                        'message' => 'Connection was unexpectedly terminated',
                    ],
                ] : [],
                'status' => $status,
                'notes' => $status === 'interrupted' ? 'Session interrupted due to technical issues' : null,
            ]);
        }
        
        $this->command->info('Created 20 sample monitored visit logs.');
    }
}
