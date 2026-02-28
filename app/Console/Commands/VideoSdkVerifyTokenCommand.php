<?php

namespace App\Console\Commands;

use App\Services\VideoSdkService;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Console\Command;

class VideoSdkVerifyTokenCommand extends Command
{
    protected $signature = 'videosdk:verify-token
                            {--room=__verify__ : Room ID to use in token}
                            {--participant=__verify__ : Participant ID to use}';

    protected $description = 'Generate a VideoSDK participant token, decode it, and verify payload (version 2, exp in future, apikey present).';

    public function handle(): int
    {
        $service = new VideoSdkService;

        $roomId = $this->option('room');
        $participantId = $this->option('participant');

        $result = $service->generateParticipantToken($roomId, $participantId, ['allow_join'], 60);
        if (! ($result['success'] ?? false) || empty($result['token'])) {
            $this->error('Token generation failed: '.($result['error'] ?? 'unknown'));

            return self::FAILURE;
        }

        $token = $result['token'];
        $secret = config('services.videosdk.secret_key');
        if (! $secret) {
            $this->error('VIDEOSDK_SECRET_KEY not set. Cannot decode.');

            return self::FAILURE;
        }

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $payload = (array) $decoded;
        } catch (\Throwable $e) {
            $this->error('Decode failed (wrong secret or malformed token): '.$e->getMessage());

            return self::FAILURE;
        }

        $version = $payload['version'] ?? null;
        $exp = isset($payload['exp']) ? (int) $payload['exp'] : null;
        $iat = isset($payload['iat']) ? (int) $payload['iat'] : null;
        $apikey = $payload['apikey'] ?? '';
        $permissions = $payload['permissions'] ?? [];
        $roomIdDecoded = $payload['roomId'] ?? null;
        $participantIdDecoded = $payload['participantId'] ?? null;

        $serverTime = time();
        $this->info('Token generated and decoded successfully.');
        $this->table(
            ['Key', 'Value'],
            [
                ['version', $version],
                ['exp (timestamp)', $exp],
                ['exp (ISO)', $exp ? date('c', $exp) : '—'],
                ['iat (timestamp)', $iat],
                ['server time (UTC)', gmdate('c', $serverTime)],
                ['apikey (last 4)', strlen($apikey) >= 4 ? substr($apikey, -4) : '(empty)'],
                ['permissions', implode(', ', (array) $permissions)],
                ['roomId', $roomIdDecoded],
                ['participantId', $participantIdDecoded],
            ]
        );

        $ok = true;
        if ($version !== 2) {
            $this->warn("Expected version === 2, got: {$version}");
            $ok = false;
        }
        if ($exp === null || $exp <= $serverTime) {
            $this->warn('exp is missing or not in the future (check server clock sync).');
            $ok = false;
        }
        if (empty($apikey)) {
            $this->warn('apikey is empty.');
            $ok = false;
        }
        if (! in_array('allow_join', (array) $permissions, true)) {
            $this->warn("permissions should include 'allow_join'.");
            $ok = false;
        }

        if ($ok) {
            $this->info('Payload verification passed: version=2, exp in future, apikey and allow_join present.');
            $this->newLine();
            $this->comment('Frontend: pass this token and meetingId (roomId) to MeetingProvider only; the SDK handles init-config internally. Successful onMeetingJoined implies WebSocket (wss://api.videosdk.live) connected with 101.');
        }

        return self::SUCCESS;
    }
}
