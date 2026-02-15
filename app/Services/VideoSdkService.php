<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VideoSdkService
{
    private string $apiKey;

    private string $secretKey;

    private string $apiEndpoint;

    private string $token;

    public function __construct()
    {
        $this->apiKey = config('services.videosdk.api_key');
        $this->secretKey = config('services.videosdk.secret_key');
        $this->apiEndpoint = config('services.videosdk.api_endpoint');
        $this->token = config('services.videosdk.token');
    }

    /**
     * Create a new video room. Retries once after 2 seconds on failure (transient errors).
     *
     * @param  string  $name  Room name
     * @param  array  $options  Additional room options
     * @return array{success: bool, room_id?: string, room_name?: string, room_url?: string, error?: string}
     */
    public function createRoom(string $name, array $options = []): array
    {
        $result = $this->createRoomOnce($name, $options);
        if ($result['success']) {
            return $result;
        }
        sleep(2);

        return $this->createRoomOnce($name, $options);
    }

    /**
     * Generate a JWT for VideoSDK server-side (v2) API. Required for create room.
     * Uses roles: ["crawler"] and version: 2 as per VideoSDK docs.
     */
    public function generateServerApiToken(int $expiryMinutes = 60): ?string
    {
        if (! $this->apiKey || ! $this->secretKey) {
            return null;
        }

        try {
            $payload = [
                'apikey' => $this->apiKey,
                'permissions' => ['allow_join', 'allow_mod'],
                'version' => 2,
                'roles' => ['crawler'],
                'iat' => now()->timestamp,
                'exp' => now()->addMinutes($expiryMinutes)->timestamp,
            ];

            return JWT::encode($payload, $this->secretKey, 'HS256');
        } catch (\Exception $e) {
            Log::error('VideoSDK server token generation failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Single attempt to create a video room.
     * Supports v1 (meetings) and v2 (rooms) API. For v2, uses server-generated token when secret is set.
     *
     * @param  string  $name  Room name
     * @param  array  $options  Additional room options
     * @return array{success: bool, room_id?: string, room_name?: string, room_url?: string, error?: string}
     */
    public function createRoomOnce(string $name, array $options = []): array
    {
        $isV1 = str_contains($this->apiEndpoint, '/v1/meetings');

        if ($isV1) {
            if (! $this->apiEndpoint || ! $this->token) {
                Log::error('VideoSDK v1: endpoint or token not configured');

                return ['success' => false, 'error' => 'VideoSDK v1 requires VIDEOSDK_API_ENDPOINT and VIDEOSDK_TOKEN.'];
            }
        } else {
            if (! $this->apiKey || ! $this->apiEndpoint) {
                Log::error('VideoSDK API key or endpoint not configured');

                return ['success' => false, 'error' => 'VideoSDK service not configured. Set VIDEOSDK_API_KEY, VIDEOSDK_API_ENDPOINT, and VIDEOSDK_SECRET_KEY for room creation.'];
            }
        }

        try {
            if ($isV1) {
                $requestBody = ['userMeetingId' => $name];
                $authHeader = $this->token;
                if (! str_starts_with(trim($authHeader), 'Bearer ')) {
                    $authHeader = 'Bearer '.trim($authHeader);
                }
            } else {
                $requestBody = array_merge(['customRoomId' => $name], $options);
                $serverToken = $this->generateServerApiToken();
                $authHeader = $serverToken ?? $this->token;
                if (! $authHeader) {
                    return ['success' => false, 'error' => 'VideoSDK: Could not generate server token. Ensure VIDEOSDK_SECRET_KEY is set for v2 API.'];
                }
                // v2 API: official examples use raw token in Authorization (no "Bearer " prefix)
                $authHeader = trim($authHeader);
            }

            Log::info('Creating VideoSDK room', [
                'room_name' => $name,
                'endpoint' => $this->apiEndpoint,
                'api_version' => $isV1 ? 'v1' : 'v2',
            ]);

            $response = Http::timeout(30)->withHeaders([
                'Authorization' => $authHeader,
                'Content-Type' => 'application/json',
            ])->post($this->apiEndpoint, $requestBody);

            if ($response->successful()) {
                $data = $response->json();

                if ($isV1) {
                    $roomId = $data['meetingId'] ?? $data['roomId'] ?? $data['id'] ?? $name;
                } else {
                    $roomId = $data['roomId'] ?? $data['id'] ?? $data['customRoomId'] ?? $name;
                }

                $roomUrl = $data['links']['room'] ?? $data['roomUrl'] ?? $data['url'] ?? null;
                if (! $roomUrl && $roomId) {
                    $roomUrl = "https://app.videosdk.live/meetings/{$roomId}";
                }

                Log::info('VideoSDK room created successfully', [
                    'room_id' => $roomId,
                    'room_name' => $name,
                    'room_url' => $roomUrl,
                ]);

                return [
                    'success' => true,
                    'room_id' => $roomId,
                    'room_name' => $data['name'] ?? $data['customRoomId'] ?? $data['userMeetingId'] ?? $name,
                    'room_url' => $roomUrl,
                ];
            }

            $errorBody = $response->json();
            $errorMessage = 'Failed to create video room';

            if (is_array($errorBody)) {
                $errorMessage = $errorBody['error']['message'] ?? $errorBody['message'] ?? $errorBody['error'] ?? $errorMessage;
            } else {
                $errorMessage = $response->body() ?: $errorMessage;
            }

            Log::error('Failed to create VideoSDK room', [
                'response' => $response->body(),
                'status' => $response->status(),
                'error' => $errorMessage,
                'request_body' => $requestBody,
            ]);

            return [
                'success' => false,
                'error' => $errorMessage,
            ];
        } catch (\Exception $e) {
            Log::error('VideoSDK room creation exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Get room details.
     *
     * @return array{success: bool, room?: array, error?: string}
     */
    public function getRoom(string $roomId): array
    {
        if (! $this->apiKey || ! $this->apiEndpoint) {
            return ['success' => false, 'error' => 'VideoSDK service not configured'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->token}",
            ])->get("{$this->apiEndpoint}/{$roomId}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'room' => $response->json(),
                ];
            }

            return ['success' => false, 'error' => 'Room not found'];
        } catch (\Exception $e) {
            Log::error('VideoSDK get room exception', [
                'room_id' => $roomId,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Delete a room.
     *
     * @return array{success: bool, error?: string}
     */
    public function deleteRoom(string $roomId): array
    {
        if (! $this->apiKey || ! $this->apiEndpoint) {
            return ['success' => false, 'error' => 'VideoSDK service not configured'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->token}",
            ])->delete("{$this->apiEndpoint}/{$roomId}");

            if ($response->successful()) {
                Log::info('VideoSDK room deleted', ['room_id' => $roomId]);

                return ['success' => true];
            }

            return ['success' => false, 'error' => 'Failed to delete room'];
        } catch (\Exception $e) {
            Log::error('VideoSDK delete room exception', [
                'room_id' => $roomId,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Generate a token for joining a room (legacy - returns static token).
     */
    public function generateToken(string $roomId, array $permissions = ['allow_join']): string
    {
        return $this->token;
    }

    /**
     * Generate a participant JWT for VideoSDK room join.
     * Permissions: allow_join (publish), allow_mod (admin - mute/remove others).
     *
     * @param  array{allow_join?: bool, ask_join?: bool, allow_mod?: bool}  $permissions
     */
    public function generateParticipantToken(
        string $roomId,
        string $participantId,
        array $permissions = ['allow_join'],
        int $expiryMinutes = 120
    ): array {
        if (! $this->apiKey || ! $this->secretKey) {
            Log::error('VideoSDK API key or secret not configured');

            return ['success' => false, 'error' => 'VideoSDK not configured', 'token' => null];
        }

        try {
            $payload = [
                'apikey' => $this->apiKey,
                'permissions' => $permissions,
                'version' => 2,
                'roomId' => $roomId,
                'participantId' => $participantId,
                'roles' => 'rtc',
                'exp' => now()->addMinutes($expiryMinutes)->timestamp,
                'iat' => now()->timestamp,
            ];

            $token = JWT::encode($payload, $this->secretKey, 'HS256');

            return ['success' => true, 'token' => $token];
        } catch (\Exception $e) {
            Log::error('VideoSDK participant token generation failed', ['error' => $e->getMessage()]);

            return ['success' => false, 'error' => $e->getMessage(), 'token' => null];
        }
    }

    /**
     * Start participant recording for a room.
     *
     * @return array{success: bool, error?: string}
     */
    public function startRecording(string $roomId, string $participantId): array
    {
        if (! $this->token) {
            return ['success' => false, 'error' => 'VideoSDK not configured'];
        }

        $endpoint = 'https://api.videosdk.live/v2/recordings/participant/start';
        try {
            $response = Http::timeout(30)->withHeaders([
                'Authorization' => $this->token,
                'Content-Type' => 'application/json',
            ])->post($endpoint, [
                'roomId' => $roomId,
                'participantId' => $participantId,
            ]);

            if ($response->successful()) {
                return ['success' => true];
            }

            $body = $response->json();
            $error = is_array($body) ? ($body['message'] ?? $body['error'] ?? $response->body()) : $response->body();

            return ['success' => false, 'error' => $error];
        } catch (\Exception $e) {
            Log::error('VideoSDK start recording exception', ['error' => $e->getMessage()]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Stop participant recording for a room.
     *
     * @return array{success: bool, error?: string}
     */
    public function stopRecording(string $roomId, string $participantId): array
    {
        if (! $this->token) {
            return ['success' => false, 'error' => 'VideoSDK not configured'];
        }

        $endpoint = 'https://api.videosdk.live/v2/recordings/participant/stop';
        try {
            $response = Http::timeout(30)->withHeaders([
                'Authorization' => $this->token,
                'Content-Type' => 'application/json',
            ])->post($endpoint, [
                'roomId' => $roomId,
                'participantId' => $participantId,
            ]);

            if ($response->successful()) {
                return ['success' => true];
            }

            $body = $response->json();
            $error = is_array($body) ? ($body['message'] ?? $body['error'] ?? $response->body()) : $response->body();

            return ['success' => false, 'error' => $error];
        } catch (\Exception $e) {
            Log::error('VideoSDK stop recording exception', ['error' => $e->getMessage()]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
