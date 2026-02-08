<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DailyCoService
{
    private string $apiKey;

    private string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.daily_co.api_key');
        $this->apiUrl = config('services.daily_co.api_url', 'https://api.daily.co/v1');
    }

    /**
     * Create a new Daily.co room for a visit or e-burol session.
     *
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>|null
     */
    public function createRoom(string $roomName, array $config = []): ?array
    {
        $defaultConfig = [
            'properties' => [
                'enable_chat' => true,
                'enable_screenshare' => true,
                'enable_recording' => 'cloud',
                'enable_knocking' => false,
                'enable_prejoin_ui' => true,
                'exp' => time() + (24 * 60 * 60), // 24 hours expiry
                'max_participants' => 10,
                'nbf' => time(),
            ],
        ];

        $mergedConfig = array_merge_recursive($defaultConfig, $config);

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/rooms", [
                'name' => $roomName,
                'config' => $mergedConfig['properties'],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Daily.co room created', ['room_id' => $data['id'] ?? null]);

                return [
                    'room_id' => $data['id'] ?? null,
                    'room_name' => $data['name'] ?? $roomName,
                    'room_url' => $data['url'] ?? null,
                    'config' => $data['config'] ?? $mergedConfig['properties'],
                ];
            }

            Log::error('Daily.co room creation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Daily.co API error', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Generate a meeting token for a participant.
     *
     * @param  array<string, mixed>  $properties
     */
    public function createToken(string $roomName, string $userId, string $userName, array $properties = []): ?string
    {
        $defaultProperties = [
            'room_name' => $roomName,
            'user_id' => $userId,
            'user_name' => $userName,
            'exp' => time() + (24 * 60 * 60), // 24 hours expiry
        ];

        $mergedProperties = array_merge($defaultProperties, $properties);

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/meeting-tokens", $mergedProperties);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Daily.co token created', ['token' => $data['token'] ?? null]);

                return $data['token'] ?? null;
            }

            Log::error('Daily.co token creation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Daily.co token API error', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Generate a one-time token for inmate terminal.
     */
    public function createInmateToken(string $roomName, string $sessionId): ?string
    {
        return $this->createToken($roomName, "inmate-{$sessionId}", 'Inmate Terminal', [
            'is_owner' => false,
            'can_send' => true,
            'can_admin' => false,
        ]);
    }

    /**
     * Generate a moderator token for monitoring officer.
     */
    public function createModeratorToken(string $roomName, string $userId, string $userName): ?string
    {
        return $this->createToken($roomName, $userId, $userName, [
            'is_owner' => false,
            'can_send' => true,
            'can_admin' => true,
            'enable_recording' => true,
        ]);
    }

    /**
     * Get room information.
     *
     * @return array<string, mixed>|null
     */
    public function getRoom(string $roomName): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
            ])->get("{$this->apiUrl}/rooms/{$roomName}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Daily.co get room error', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Delete a room.
     */
    public function deleteRoom(string $roomName): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
            ])->delete("{$this->apiUrl}/rooms/{$roomName}");

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Daily.co delete room error', ['message' => $e->getMessage()]);

            return false;
        }
    }

    /**
     * Get recording information.
     *
     * @return array<string, mixed>|null
     */
    public function getRecording(string $recordingId): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
            ])->get("{$this->apiUrl}/recordings/{$recordingId}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Daily.co get recording error', ['message' => $e->getMessage()]);

            return null;
        }
    }
}
