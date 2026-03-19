<?php

namespace App\Console\Commands;

use App\Services\VideoSdkService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class VideoSdkDebugInitConfigCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'videosdk:debug-init-config
                            {room : Room ID to test}
                            {--participant=debug_cli : Participant ID to embed in token}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug VideoSDK init-config auth by calling infra endpoint with both raw and Bearer token headers.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $roomId = (string) $this->argument('room');
        $participantId = (string) $this->option('participant');

        /** @var VideoSdkService $videoSdk */
        $videoSdk = app(VideoSdkService::class);

        $tokenResult = $videoSdk->generateParticipantToken($roomId, $participantId, ['allow_join'], 30);
        if (! ($tokenResult['success'] ?? false) || empty($tokenResult['token'])) {
            $this->error('Token generation failed: '.($tokenResult['error'] ?? 'unknown'));

            return self::FAILURE;
        }

        $token = (string) $tokenResult['token'];
        $this->info('Token generated.');
        $this->line('token_prefix: '.substr($token, 0, 24).'...');

        $endpoint = 'https://api.videosdk.live/infra/v1/meetings/init-config';
        $payload = ['roomId' => $roomId];

        $cases = [
            'raw' => $token,
            'bearer' => 'Bearer '.$token,
        ];

        foreach ($cases as $label => $authHeader) {
            $res = Http::timeout(20)->withHeaders([
                'Authorization' => $authHeader,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($endpoint, $payload);

            $this->newLine();
            $this->info("Case: {$label}");
            $this->line('status: '.$res->status());
            $this->line('body: '.($res->body() ?: '(empty)'));
        }

        $this->newLine();
        $this->comment('If one case is 200 and the other is 401, we need to match that header format in the browser token usage.');

        return self::SUCCESS;
    }
}
