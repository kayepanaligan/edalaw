@extends('layouts.visitor')

@section('title', 'Video Call Session - ' . config('app.name', 'eDalaw'))

@section('content')
<div class="py-12">
    <div class="max-w-md mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-8 bg-white border-b border-gray-200">
                <!-- Video Icon -->
                <div class="flex justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>

                <!-- Title -->
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-semibold text-gray-900 mb-2">Video Call</h1>
                    <p class="text-sm text-gray-600">
                        {{ ucfirst($session['session_type']) }} with {{ $session['inmate_name'] }}
                    </p>
                </div>

                <!-- Join Button or Schedule Message -->
                @if($session['can_join_now'] && $session['join_url'])
                    <button id="joinButton" onclick="handleJoin()" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Join Call
                    </button>
                @elseif($session['schedule_reminder'])
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 text-center">
                            Join will be available at your scheduled time. You can stay on this page and refresh when ready.
                        </p>
                        <button onclick="window.location.reload()" 
                                class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200">
                            Refresh to check if it's time
                        </button>
                        
                        <!-- Schedule Info -->
                        <div class="bg-gray-50 p-4 rounded-lg mt-4">
                            <p class="text-sm font-medium text-gray-900">
                                Scheduled: {{ $session['schedule_reminder']['scheduled_label'] }}
                            </p>
                            <p class="text-sm text-gray-600 mt-1">
                                Time left: <span id="countdown"></span>
                            </p>
                        </div>
                    </div>
                @else
                    <p class="text-sm text-gray-600 text-center">
                        This session is no longer available.
                    </p>
                @endif

                <!-- Disclaimer -->
                <p class="text-xs text-gray-500 text-center mt-6">
                    You will be redirected to the video call. The call is monitored and recorded.
                </p>
            </div>
        </div>
    </div>
</div>

<!-- Schedule Reminder Modal -->
@if($session['schedule_reminder'])
<div id="reminderModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Session Schedule</h3>
            <div class="mt-4 px-4 py-3">
                <p class="text-sm text-gray-500">
                    Your session has not started yet. You can stay on this page and join when it's time.
                </p>
                <div class="mt-4 space-y-2">
                    <p class="text-sm font-medium text-gray-900">
                        Scheduled: {{ $session['schedule_reminder']['scheduled_label'] }}
                    </p>
                    <p class="text-sm text-gray-600">
                        Time left: <span id="modalCountdown"></span>
                    </p>
                </div>
            </div>
            <div class="mt-4 flex gap-3 justify-center">
                <button onclick="closeModal()" 
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200">
                    I'll wait
                </button>
                <button onclick="window.location.reload()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    Refresh when it's time
                </button>
            </div>
        </div>
    </div>
</div>
@endif
@endsection

@push('scripts')
<script>
    // Show modal on page load if there's a schedule reminder
    @if($session['schedule_reminder'])
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('reminderModal').classList.remove('hidden');
        startCountdown();
        
        // Mark participant as joined
        markParticipantJoined();
    });
    @elseif($session['can_join_now'])
    document.addEventListener('DOMContentLoaded', function() {
        // Mark participant as joined if session is active
        markParticipantJoined();
    });
    @endif

    function handleJoin() {
        const joinButton = document.getElementById('joinButton');
        if (!joinButton) return;
        
        joinButton.disabled = true;
        joinButton.textContent = 'Opening...';
        
        // Open video call in new tab
        window.open('{{ $session['join_url'] ?? '#' }}', '_blank');
    }

    function closeModal() {
        document.getElementById('reminderModal').classList.add('hidden');
    }

    function markParticipantJoined() {
        // Send participant joined notification to backend
        fetch('{{ route("visit-session.participant-joined", $session["id"]) }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify({
                participant_id: '{{ $session['participant_id'] }}'
            })
        }).catch(function(error) {
            console.error('Error marking participant joined:', error);
        });
    }

    function getCsrfToken() {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    function startCountdown() {
        @if($session['schedule_reminder'])
        const hours = {{ $session['schedule_reminder']['hours_until_start'] }};
        const minutes = {{ $session['schedule_reminder']['minutes_until_start'] }};
        
        let totalMinutes = hours * 60 + minutes;
        
        const countdownElements = [
            document.getElementById('countdown'),
            document.getElementById('modalCountdown')
        ];
        
        function updateCountdown() {
            if (totalMinutes <= 0) {
                countdownElements.forEach(el => {
                    if (el) el.textContent = 'Starting soon...';
                });
                return;
            }
            
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            
            const text = h > 0 
                ? `${h} hour${h !== 1 ? 's' : ''} and ${m} minute${m !== 1 ? 's' : ''}`
                : `${m} minute${m !== 1 ? 's' : ''}`;
            
            countdownElements.forEach(el => {
                if (el) el.textContent = text;
            });
            
            totalMinutes--;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
        @endif
    }
</script>
@endpush
