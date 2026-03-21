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
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $title ?? 'Session Not Available' }}</h1>
        
        @if(isset($schedule_window))
            <p class="text-gray-600 mb-2">Scheduled time: {{ $schedule_window }}</p>
        @endif
        
        @if(isset($time_until_active))
            <p class="text-sm text-gray-500 mb-6">
                This session will start in <span class="font-semibold text-yellow-600">{{ $time_until_active }}</span>
            </p>
        @endif
        
        <p class="text-gray-600 mb-6">
            Please wait until the scheduled time to join the session.
        </p>
        
        <button 
            onclick="window.location.reload()"
            class="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Refresh Page
        </button>
    </div>
</body>
</html>
