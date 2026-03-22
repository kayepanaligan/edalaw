<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Session Not Available' }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $title ?? 'Waiting for Session' }}</h1>
        
        @if(isset($schedule_window))
            <p class="text-gray-600 mb-2">Scheduled time: {{ $schedule_window }}</p>
        @endif
        
        <div id="countdown-container" class="mb-6">
            @if(isset($time_until_active))
                <p class="text-sm text-gray-500 mb-2">
                    Session starts in:
                </p>
                <div id="countdown" class="text-3xl font-bold text-orange-600">
                    {{ $time_until_active }}
                </div>
            @endif
        </div>
        
        <div id="waiting-message" class="mb-6">
            <p class="text-gray-600">
                You're in the waiting room. The session will start automatically.
            </p>
            <p class="text-xs text-gray-500 mt-2">
                No need to refresh - you'll be redirected automatically.
            </p>
        </div>
        
        <div id="loading-spinner" class="hidden mb-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p class="text-sm text-gray-600 mt-2">Redirecting to session...</p>
        </div>
        
        <button 
            onclick="window.location.reload()"
            class="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
            Refresh Page
        </button>
    </div>
    
    <script>
        const sessionId = '{{ $session_id ?? "" }}';
        const tunnelToken = '{{ $tunnel_token ?? "" }}'; // Get the tunnel token from the view data
        const checkInterval = 30000; // Check every 30 seconds
        let countdownInterval;
        
        // Function to check if session is ready
        async function checkSessionStatus() {
            try {
                const response = await fetch(`/visit-session/${sessionId}/status`);
                const data = await response.json();
                
                if (data.ready) {
                    // Session is ready - redirect to video room using tunnel token
                    document.getElementById('loading-spinner').classList.remove('hidden');
                    document.getElementById('waiting-message').classList.add('hidden');
                    document.getElementById('countdown-container').classList.add('hidden');
                    
                    setTimeout(() => {
                        window.location.href = `/inmate/join/${tunnelToken}`;
                    }, 1000);
                }
            } catch (error) {
                console.error('Error checking session status:', error);
            }
        }
        
        // Countdown timer
        function startCountdown() {
            const scheduledStart = @json($session?->scheduled_start?->toIso8601String());
            if (!scheduledStart) return;
            
            const startTime = new Date(scheduledStart).getTime();
            
            countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = startTime - now;
                
                if (distance < 0) {
                    // Time has come - check session status
                    clearInterval(countdownInterval);
                    checkSessionStatus();
                    return;
                }
                
                // Calculate time remaining
                const hours = Math.floor(distance / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                // Display result
                let display = '';
                if (hours > 0) {
                    display += `${hours}h `;
                }
                if (minutes > 0 || hours > 0) {
                    display += `${minutes}m `;
                }
                display += `${seconds}s`;
                
                document.getElementById('countdown').textContent = display;
            }, 1000);
        }
        
        // Start countdown on page load
        startCountdown();
        
        // Check session status periodically
        checkSessionStatus();
        setInterval(checkSessionStatus, checkInterval);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        });
    </script>
</body>
</html>
