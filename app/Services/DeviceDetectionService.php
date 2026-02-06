<?php

namespace App\Services;

class DeviceDetectionService
{
    /**
     * Parse user agent and extract device information.
     */
    public static function parseUserAgent(?string $userAgent): array
    {
        if (! $userAgent) {
            return [
                'device_type' => 'unknown',
                'device_name' => 'Unknown Device',
                'browser' => 'Unknown Browser',
                'platform' => 'Unknown Platform',
            ];
        }

        $deviceType = 'desktop';
        $deviceName = 'Unknown Device';
        $browser = 'Unknown Browser';
        $platform = 'Unknown Platform';

        // Detect device type
        if (preg_match('/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i', $userAgent)) {
            if (preg_match('/tablet|ipad|playbook|silk/i', $userAgent)) {
                $deviceType = 'tablet';
            } else {
                $deviceType = 'mobile';
            }
        }

        // Detect platform/OS
        if (preg_match('/windows|win32|win64/i', $userAgent)) {
            $platform = 'Windows';
            if (preg_match('/windows nt 10/i', $userAgent)) {
                $deviceName = 'Windows 10/11';
            } elseif (preg_match('/windows nt 6.3/i', $userAgent)) {
                $deviceName = 'Windows 8.1';
            } elseif (preg_match('/windows nt 6.2/i', $userAgent)) {
                $deviceName = 'Windows 8';
            } elseif (preg_match('/windows nt 6.1/i', $userAgent)) {
                $deviceName = 'Windows 7';
            } else {
                $deviceName = 'Windows';
            }
        } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
            $platform = 'macOS';
            if (preg_match('/mac os x 10[._](\d+)/i', $userAgent, $matches)) {
                $version = $matches[1] ?? '';
                $deviceName = "macOS {$version}";
            } else {
                $deviceName = 'macOS';
            }
        } elseif (preg_match('/linux/i', $userAgent)) {
            $platform = 'Linux';
            $deviceName = 'Linux';
        } elseif (preg_match('/android/i', $userAgent)) {
            $platform = 'Android';
            if (preg_match('/android ([\d.]+)/i', $userAgent, $matches)) {
                $version = $matches[1] ?? '';
                $deviceName = "Android {$version}";
            } else {
                $deviceName = 'Android';
            }
        } elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
            $platform = 'iOS';
            if (preg_match('/iphone/i', $userAgent)) {
                $deviceName = 'iPhone';
            } elseif (preg_match('/ipad/i', $userAgent)) {
                $deviceName = 'iPad';
            } else {
                $deviceName = 'iOS Device';
            }
        }

        // Detect browser
        if (preg_match('/edg/i', $userAgent)) {
            $browser = 'Microsoft Edge';
        } elseif (preg_match('/chrome/i', $userAgent) && ! preg_match('/edg/i', $userAgent)) {
            $browser = 'Google Chrome';
        } elseif (preg_match('/safari/i', $userAgent) && ! preg_match('/chrome/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/firefox/i', $userAgent)) {
            $browser = 'Mozilla Firefox';
        } elseif (preg_match('/opera|opr/i', $userAgent)) {
            $browser = 'Opera';
        }

        return [
            'device_type' => $deviceType,
            'device_name' => $deviceName,
            'browser' => $browser,
            'platform' => $platform,
        ];
    }

    /**
     * Get location from IP address (simplified - can be enhanced with IP geolocation service).
     */
    public static function getLocationFromIp(?string $ipAddress): ?string
    {
        if (! $ipAddress || $ipAddress === '127.0.0.1' || $ipAddress === '::1') {
            return 'Local';
        }

        // For production, you can integrate with IP geolocation services like:
        // - ipapi.co
        // - ip-api.com
        // - maxmind.com
        // For now, return null and let it be populated manually or via a service

        return null;
    }
}
