@extends('layouts.visitor')

@section('title', 'Secure Video Call - ' . config('app.name', 'eDalaw'))

@push('styles')
<style>
    #video-container {
        width: 100%;
        height: 600px;
        position: relative;
    }
    
    .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>
@endpush

@section('content')
<div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6 bg-white border-b border-gray-200">
                <div id="video-container">
                    <!-- Loading State -->
                    <div id="loadingState" class="loading-state">
                        <div class="text-center">
                            <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p class="text-gray-600">Loading secure video session...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Session Timer Display -->
        <div id="session-timer" style="position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; display: none;">
            <span style="margin-right: 8px;">⏰</span>
            <span id="timer-display">--:--</span>
            <span id="timer-label" style="font-size: 12px; font-weight: normal; margin-left: 8px; opacity: 0.9;">remaining</span>
        </div>
    </div>
</div>

<!-- SweetAlert2 for notifications -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
    const meetingId = '{{ $room_id }}';
    const apiKey = '{{ config('services.videosdk.api_key') }}'; // Use server API key, not JWT
    const participantName = '{{ $participant_name }}';
    const participantId = '{{ $participant_id }}';
    const isObserver = {{ $is_observer ? 'true' : 'false' }};
    const scheduledEnd = '{{ $scheduled_end ?? "" }}';

    function initVideoCall() {
        // Load VideoSDK RTC Prebuilt script (latest version for v2 support)
        const script = document.createElement("script");
        script.type = "text/javascript";
        
        script.addEventListener("load", function () {
            console.log('VideoSDK SDK loaded');
            console.log('Meeting ID:', meetingId);
            console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
            console.log('Scheduled End:', scheduledEnd);
            
            const config = {
                name: participantName,
                meetingId: meetingId,
                apiKey: apiKey, // Use server API key from .env
                micEnabled: true,
                webcamEnabled: !isObserver,
                participantCanToggleSelfWebcam: true,
                participantCanToggleSelfMic: true,
                chatEnabled: true,
                screenShareEnabled: true,
                joinScreen: {
                    visible: true,
                    title: "eDalaw Video Call",
                },
                branding: {
                    enabled: true,
                    logoURL: "/edalaw_logo.png",
                    poweredBy: false,
                    name: "eDalaw",
                },
                permissions: {
                    endMeeting: false, // Only monitor can end
                },
            };

            try {
                const meeting = new VideoSDKMeeting();
                meeting.init(config);
                
                // Hide loading state
                document.getElementById('loadingState').style.display = 'none';
                
                console.log('Video call initialized successfully');
                
                // Setup automatic session end based on scheduled time
                if (scheduledEnd) {
                    setupSessionEndTimer(meeting, scheduledEnd);
                }
            } catch (error) {
                console.error('Failed to initialize VideoSDK:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Initialization Error',
                    text: error.message || 'Failed to load video call',
                    confirmButtonText: 'Close'
                }).then(() => {
                    window.location.href = '{{ route('visit-session.show', $session->id) }}';
                });
            }
        });

        // Use SDK version from working example
        script.src = "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.43/rtc-js-prebuilt.js";
        document.head.appendChild(script);
    }
    
    /**
     * Setup timer to automatically end meeting when scheduled time expires
     */
    function setupSessionEndTimer(meeting, scheduledEnd) {
        const endTime = new Date(scheduledEnd).getTime();
        
        // Show and update timer display
        const timerElement = document.getElementById('session-timer');
        const timerDisplay = document.getElementById('timer-display');
        
        if (timerElement) {
            timerElement.style.display = 'block';
        }
        
        // Update timer every second
        function updateTimer() {
            const now = new Date().getTime();
            const timeRemaining = endTime - now;
            
            if (timeRemaining > 0) {
                // Calculate minutes and seconds
                const minutes = Math.floor(timeRemaining / 60000);
                const seconds = Math.floor((timeRemaining % 60000) / 1000);
                
                // Format as MM:SS
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Change color when less than 1 minute remaining
                if (timeRemaining < 60000) {
                    timerElement.style.background = 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)';
                    timerDisplay.style.color = '#fff';
                }
            } else {
                // Time's up
                timerDisplay.textContent = '00:00';
                if (timerElement) {
                    timerElement.style.display = 'none';
                }
            }
        }
        
        // Update immediately and then every second
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        
        // Check every 5 seconds if session should end
        const checkInterval = setInterval(() => {
            const now = new Date().getTime();
            const timeRemaining = endTime - now;
            
            console.log('Session check - Time remaining:', timeRemaining, 'ms');
            
            // If time has expired (with 5 second grace period)
            if (timeRemaining <= 5000) {
                clearInterval(checkInterval);
                clearInterval(timerInterval);
                
                // Hide timer
                if (timerElement) {
                    timerElement.style.display = 'none';
                }
                
                // Show warning 5 seconds before end
                if (timeRemaining > 0) {
                    const secondsLeft = Math.ceil(timeRemaining / 1000);
                    console.log('Session ending in', secondsLeft, 'seconds...');
                }
                
                // End the meeting
                setTimeout(() => {
                    endSession(meeting);
                }, Math.max(0, timeRemaining));
            }
        }, 5000); // Check every 5 seconds
        
        // Also set a precise timeout for ending
        const timeout = endTime - new Date().getTime();
        if (timeout > 0) {
            setTimeout(() => {
                clearInterval(timerInterval);
                endSession(meeting);
            }, timeout + 2000); // 2 second buffer
        } else {
            // Session already expired
            endSession(meeting);
        }
    }
    
    /**
     * End the video call session
     */
    function endSession(meeting) {
        console.log('Session time expired - ending call...');
        
        // Signal main tab to refresh (for visitor/jail officer)
        const mainTabKey = 'session_refresh_{{ $session->id }}';
        localStorage.setItem(mainTabKey, 'ended');
        
        Swal.fire({
            icon: 'info',
            title: 'Session Ended',
            text: 'Your scheduled time has ended. The call will now disconnect and this tab will close.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            // Try to leave the meeting gracefully
            try {
                if (meeting && typeof meeting.leave === 'function') {
                    meeting.leave();
                }
            } catch (e) {
                console.error('Error leaving meeting:', e);
            }
            
            // Try to close the window/tab
            // Note: This only works if the window was opened by script (window.open)
            if (window.opener) {
                // Window was opened by script, safe to close
                window.close();
            } else {
                // Fallback: redirect to session page if close fails
                setTimeout(() => {
                    window.location.href = '{{ route('visit-session.show', $session->id) }}';
                }, 500);
            }
        });
    }

    // Initialize on page load
    initVideoCall();
</script>
@endsection
