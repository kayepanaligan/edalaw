@extends('layouts.visitor')

@section('content')
<div class="container-fluid" style="height: 100vh; overflow: hidden;">
    <!-- Video Container -->
    <div id="video-container" style="height: 100vh; background: #000;"></div>
    
    <!-- Floating Action Button for Chat -->
    <button id="chat-fab" type="button" onclick="toggleChatModal()" 
        style="position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:#2563eb;color:white;border:none;box-shadow:0 4px 12px rgba(37,99,235,0.4);cursor:pointer;z-index:9998;font-size:24px;display:flex;align-items:center;justify-content:center;">
        💬
    </button>
    
    <!-- Chat Modal (Hidden by default) -->
    <div id="chat-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;" onclick="closeChatModal(event)">
        <div style="position:absolute;bottom:100px;right:30px;width:400px;max-height:600px;background:white;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);display:flex;flex-direction:column;" onclick="event.stopPropagation()">
            <!-- Modal Header -->
            <div style="padding:16px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;font-size:16px;font-weight:600;color:#1f2937;">💬 Session Chat</h3>
                <button onclick="closeChatModalDirect()" style="background:none;border:none;font-size:24px;color:#6b7280;cursor:pointer;">&times;</button>
            </div>
            
            <!-- Messages Area -->
            <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;min-height:300px;"></div>
            
            <!-- Input Area -->
            <div style="padding:16px;border-top:1px solid #e5e7eb;">
                <form id="chat-form">
                    <textarea id="chat-message-input" placeholder="Type your message..." rows="3" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;resize:none;font-family:inherit;font-size:14px;" maxlength="1000"></textarea>
                    <button type="button" id="send-button" style="width:100%;margin-top:8px;padding:12px;background:#2563eb;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:14px;">📤 Send Message</button>
                </form>
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

<script src="https://sdk.videosdk.live/rtc-js-prebuilt/0.3.43/rtc-js-prebuilt.js"></script>

<script>
<<<<<<< HEAD
// Global variables
let chatModalOpen = false;
const CURRENT_USER_ID = @json(auth()->id());
const CURRENT_USER_NAME = @json($participant_name ?? 'Guest');
const ROOM_ID = @json($room_id);
=======
    const meetingId = '{{ $room_id }}';
    const apiKey = '{{ config('services.videosdk.api_key') }}'; // Use server API key, not JWT
    const participantName = '{{ $participant_name }}';
    const participantId = '{{ $participant_id }}';
    const isObserver = {{ $is_observer ? 'true' : 'false' }};
    const scheduledEnd = '{{ $scheduled_end ?? "" }}';
>>>>>>> e69833972c5a878e5f37be563a834987753c69b2

console.log("💬 [CHAT] Initialized - User:", CURRENT_USER_ID, "Room:", ROOM_ID);

// Toggle chat modal
function toggleChatModal() {
    const modal = document.getElementById('chat-modal');
    if (chatModalOpen) {
        modal.style.display = 'none';
        chatModalOpen = false;
    } else {
        modal.style.display = 'block';
        chatModalOpen = true;
        loadChatHistory();
        setTimeout(() => scrollToBottom(), 100);
    }
}

// Close modal functions
function closeChatModal(event) {
    if (event.target === document.getElementById('chat-modal')) {
        toggleChatModal();
    }
}

function closeChatModalDirect() {
    toggleChatModal();
}

// Load chat history
async function loadChatHistory() {
    try {
        console.log("📥 Loading chat history for room:", ROOM_ID);
        const response = await fetch(`/video/chat/history/${ROOM_ID}`);
        const result = await response.json();
        
<<<<<<< HEAD
        if (result.success) {
            console.log("✅ Loaded", result.messages?.length || 0, "messages");
            displayMessages(result.messages);
        } else {
            console.error("❌ Failed to load:", result.error);
        }
    } catch (err) {
        console.error("❌ Load error:", err);
    }
}

// Display messages
function displayMessages(messages) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    if (!messages || messages.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#9ca3af;margin-top:40px;font-size:14px;">No messages yet.<br>Start the conversation!</div>';
        return;
    }
    
    container.innerHTML = '';
    messages.forEach(msg => appendMessage(msg));
}

// Append single message
function appendMessage(message) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const isOwn = message.sender_id == CURRENT_USER_ID;
    
    const div = document.createElement('div');
    div.style.cssText = `margin-bottom:12px;padding:10px 14px;border-radius:8px;${isOwn?'background:#dbeafe;margin-left:20%;':'background:#f3f4f6;margin-right:20%;'}`;
    
    const name = document.createElement('div');
    name.style.cssText = 'font-size:11px;font-weight:600;color:#6b7280;margin-bottom:4px;';
    name.textContent = message.sender;
    
    const text = document.createElement('div');
    text.style.cssText = 'font-size:14px;color:#1f2937;word-wrap:break-word;line-height:1.4;';
    text.textContent = message.message;
    
    const time = document.createElement('div');
    time.style.cssText = 'font-size:10px;color:#9ca3af;margin-top:6px;text-align:right;';
    time.textContent = new Date(message.sent_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    
    div.appendChild(name);
    div.appendChild(text);
    div.appendChild(time);
    container.appendChild(div);
}

// Scroll to bottom
function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// Send message function
async function sendMessage() {
    console.log("🔵 Sending message...");
    
    const input = document.getElementById('chat-message-input');
    const messageText = input.value.trim();
    
    if (!messageText) {
        alert('Please enter a message');
        return;
    }
    
    if (!ROOM_ID) {
        alert('Room ID not available');
        return;
    }
    
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        console.log("🔐 CSRF Token:", csrfToken ? 'Present' : 'Missing');
        
        const payload = {
            room_id: ROOM_ID,
            sender_id: CURRENT_USER_ID,
            sender_name: CURRENT_USER_NAME,
            message: messageText
        };
        
        console.log("📤 Sending payload:", payload);
        
        const response = await fetch('/video/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log("📥 Response status:", response.status);
        const result = await response.json();
        console.log("📥 Response data:", result);
        
        if (result.success) {
            console.log("✅ Message sent! ID:", result.data?.id);
            input.value = '';
            
            // Add to UI immediately
            if (chatModalOpen) {
                appendMessage(result.data);
                scrollToBottom();
            }
        } else {
            console.error("❌ Failed:", result.error);
            alert('Failed to send: ' + result.error);
        }
    } catch (err) {
        console.error("❌ Error:", err);
        alert('Error sending message: ' + err.message);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM loaded - initializing chat");
    
    // Attach send button listener
    const btn = document.getElementById('send-button');
    if (btn) {
        btn.addEventListener('click', sendMessage);
        console.log("✅ Send button attached");
    }
    
    // Enter key to send
    const textarea = document.getElementById('chat-message-input');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
=======
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
>>>>>>> e69833972c5a878e5f37be563a834987753c69b2
            }
        });
    }
    
<<<<<<< HEAD
    // Auto-load chat when modal opens first time
    const fab = document.getElementById('chat-fab');
    if (fab) {
        fab.addEventListener('click', function() {
            if (!chatModalOpen) {
                loadChatHistory();
                setTimeout(() => scrollToBottom(), 200);
            }
        });
    }
});
=======
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
>>>>>>> e69833972c5a878e5f37be563a834987753c69b2

// Poll for new messages every 5 seconds
setInterval(function() {
    if (chatModalOpen) {
        loadChatHistory();
    }
}, 5000);
</script>

<script>
// VideoSDK initialization
const MEETING_ID = @json($room_id);
const API_KEY = @json(env('VIDEOSDK_API_KEY'));
const USER_NAME = @json($participant_name ?? 'Guest');

function initVideoCall() {
    if (typeof VideoSDKMeeting !== 'function') {
        console.error("❌ VideoSDK not available!");
        alert("VideoSDK library failed to load!");
        return;
    }
    
    const config = {
        name: USER_NAME,
        meetingId: MEETING_ID,
        apiKey: API_KEY,
        containerId: "video-container",
        chatEnabled: false, // Disabled - using custom chat
        micEnabled: false,
        webcamEnabled: false,
    };
    
    try {
        const instance = new VideoSDKMeeting();
        instance.init(config);
        console.log("✅ VideoSDK initialized");
    } catch (err) {
        console.error("❌ VideoSDK init failed:", err);
    }
}

window.addEventListener('load', initVideoCall);
</script>
@endsection
