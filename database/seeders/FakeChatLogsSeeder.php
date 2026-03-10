<?php

namespace Database\Seeders;

use App\Models\ChatLog;
use App\Models\User;
use App\Models\Visit;
use App\Models\VisitSession;
use App\Models\Eburol;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class FakeChatLogsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Generating fake chat logs...');

        // Get or create a visitor user
        $visitor = User::where('role_id', function ($q) {
            $q->select('id')->from('roles')->where('slug', 'visitor');
        })->first();

        if (!$visitor) {
            $this->command->warn('No visitor found. Please run SampleUsersSeeder first.');
            return;
        }

        // Get existing sessions or create mock data
        $sessions = VisitSession::with(['visit', 'eburol'])->limit(5)->get();

        if ($sessions->isEmpty()) {
            $this->command->warn('No visit sessions found. Creating mock session data...');
            $sessions = $this->createMockSessions($visitor);
        }

        $sampleMessages = [
            // Visitor messages
            ['sender' => 'visitor', 'messages' => [
                'Hello, can you hear me?',
                'I am here for the visit.',
                'How are you doing today?',
                'I brought some news from home.',
                'The kids are doing well in school.',
                'We miss you a lot.',
                'Is there anything you need?',
                'I will come back next week.',
                'Take care of yourself.',
                'We love you.',
                'The weather is nice today.',
                'Everyone says hello.',
                'I have some photos to show you.',
                'Are you eating well?',
                'Stay strong.',
            ]],
            // Inmate messages
            ['sender' => 'inmate', 'messages' => [
                'Hi, I can see you.',
                'I am doing fine, thank you.',
                'Tell everyone I miss them.',
                'How is mom doing?',
                'I got your letter last week.',
                'The food here is okay.',
                'I am staying healthy.',
                'Please send some books.',
                'I miss home so much.',
                'Tell the kids to study hard.',
                'I will be home soon.',
                'Thanks for visiting.',
                'You look good.',
                'Do not worry about me.',
                'I love you all.',
            ]],
            // Monitor messages
            ['sender' => 'monitor', 'messages' => [
                'Session started.',
                'Please keep conversations appropriate.',
                '5 minutes remaining.',
                'Please wrap up your conversation.',
                'Session ending soon.',
                'Thank you for your cooperation.',
                'Session completed.',
            ]],
        ];

        $totalMessages = 0;

        foreach ($sessions as $session) {
            // Generate 20-50 messages per session
            $messageCount = rand(20, 50);
            $startTime = Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 12));

            for ($i = 0; $i < $messageCount; $i++) {
                // Pick random sender type
                $senderType = $sampleMessages[array_rand($sampleMessages)];
                $sender = $senderType['sender'];
                $message = $senderType['messages'][array_rand($senderType['messages'])];

                // Determine sender_id based on sender type
                $senderId = match ($sender) {
                    'visitor' => $session->visit?->user_id ?? $session->eburol?->user_id ?? $visitor->id,
                    'inmate' => null, // Inmate doesn't have a user account
                    'monitor' => $session->monitor_id ?? 1,
                    default => null,
                };

                // Randomly flag some messages (5% chance)
                $flagged = rand(1, 100) <= 5;
                $flagReason = $flagged ? 'Auto-flagged: forbidden keyword.' : null;

                ChatLog::create([
                    'visit_session_id' => $session->id,
                    'sender' => $sender,
                    'sender_id' => $senderId,
                    'message' => $message,
                    'sent_at' => $startTime->copy()->addMinutes($i * 2),
                    'flagged' => $flagged,
                    'flag_reason' => $flagReason,
                    'flagged_by' => $flagged ? ($session->monitor_id ?? 1) : null,
                    'flagged_at' => $flagged ? $startTime->copy()->addMinutes($i * 2 + 1) : null,
                ]);

                $totalMessages++;
            }
        }

        $this->command->info("Generated {$totalMessages} fake chat log entries across {$sessions->count()} sessions.");
    }

    /**
     * Create mock visit sessions for testing.
     */
    private function createMockSessions(User $visitor): array
    {
        $sessions = [];

        for ($i = 0; $i < 3; $i++) {
            // Create a visit
            $visit = Visit::create([
                'user_id' => $visitor->id,
                'inmate_first_name' => 'John',
                'inmate_middle_name' => 'Doe',
                'inmate_last_name' => 'Smith',
                'relationship' => 'Family',
                'visit_type' => 'virtual',
                'scheduled_date' => Carbon::now()->subDays(rand(1, 30)),
                'scheduled_time' => '10:00:00',
                'status' => 'completed',
                'notes' => 'Test visit for chat logs',
            ]);

            // Create a session for the visit
            $session = VisitSession::create([
                'visit_id' => $visit->id,
                'room_id' => 'room_' . uniqid(),
                'monitor_id' => 1,
                'scheduled_start' => Carbon::now()->subDays(rand(1, 30)),
                'scheduled_end' => Carbon::now()->subDays(rand(1, 30))->addHour(),
                'status' => 'completed',
                'session_type' => 'visit',
                'terms_accepted_at' => Carbon::now()->subDays(rand(1, 30)),
                'visitor_joined_at' => Carbon::now()->subDays(rand(1, 30)),
                'inmate_joined_at' => Carbon::now()->subDays(rand(1, 30)),
                'started_at' => Carbon::now()->subDays(rand(1, 30)),
                'ended_at' => Carbon::now()->subDays(rand(1, 30))->addMinutes(30),
            ]);

            $sessions[] = $session;
        }

        return $sessions;
    }
}
