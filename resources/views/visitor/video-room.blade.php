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

    function initVideoCall() {
        // Load VideoSDK RTC Prebuilt script (latest version for v2 support)
        const script = document.createElement("script");
        script.type = "text/javascript";
        
        script.addEventListener("load", function () {
            console.log('VideoSDK SDK loaded');
            console.log('Meeting ID:', meetingId);
            console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
            
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

    // Initialize on page load
    initVideoCall();
</script>
@endsection
