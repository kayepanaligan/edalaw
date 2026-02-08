<?php

namespace App\Services;

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
     * Create a new video room.
     *
     * @param  string  $name  Room name
     * @param  array  $options  Additional room options
     * @return array{success: bool, room_id?: string, room_name?: string, room_url?: string, error?: string}
     */
    public function createRoom(string $name, array $options = []): array
    {
        if (! $this->apiKey || ! $this->apiEndpoint || ! $this->token) {
            Log::error('VideoSDK API key, endpoint, or token not configured');

            return ['success' => false, 'error' => 'VideoSDK service not configured'];
        }

        try {
            // VideoSDK v2 API format - use customRoomId for room name
            $requestBody = [
                'customRoomId' => $name,
            ];

            // Merge any additional options
            if (! empty($options)) {
                $requestBody = array_merge($requestBody, $options);
            }

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->token}",
                'Content-Type' => 'application/json',
            ])->post($this->apiEndpoint, $requestBody);

            if ($response->successful()) {
                $data = $response->json();

                // VideoSDK v2 API response format
                // Response may contain: roomId, links.room, or different structure
                $roomId = $data['roomId'] ?? $data['id'] ?? $data['customRoomId'] ?? $name;

                // Try different possible response formats for room URL
                $roomUrl = $data['links']['room'] ?? $data['roomUrl'] ?? $data['url'] ?? null;

                // If roomUrl is not in the response, construct it using roomId
                if (! $roomUrl && $roomId) {
                    $roomUrl = "https://app.videosdk.live/meetings/{$roomId}";
                }

                Log::info('VideoSDK room created successfully', [
                    'room_id' => $roomId,
                    'room_name' => $name,
                    'room_url' => $roomUrl,
                    'response_data' => $data,
                ]);

                return [
                    'success' => true,
                    'room_id' => $roomId,
                    'room_name' => $data['name'] ?? $data['customRoomId'] ?? $name,
                    'room_url' => $roomUrl,
                ];
            }

            $errorBody = $response->json();
            $errorMessage = 'Failed to create video room';

            if (is_array($errorBody)) {
                $errorMessage = $errorBody['error']['message'] ?? $errorBody['message'] ?? $errorBody['error'] ?? $errorMessage;
            }

            Log::error('Failed to create VideoSDK room', [
                'response' => $response->body(),
                'status' => $response->status(),
                'error' => $errorMessage,
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
     * Generate a token for joining a room.
     */
    public function generateToken(string $roomId, array $permissions = ['allow_join']): string
    {
        // For now, return the configured token
        // In production, you might want to generate room-specific tokens
        return $this->token;
    }
}
