<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Too Many Requests</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01m21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Too Many Requests</h1>
        
        <p class="text-gray-600 mb-6">
            It looks like you've sent too many requests. Please wait a moment before trying again.
        </p>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-yellow-800">
                <strong>Why did this happen?</strong><br>
                For security reasons, we limit the number of requests you can make in a short period of time.
            </p>
        </div>
        
        <div class="space-y-3">
            <button 
                onclick="window.history.back()"
                class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
                ← Go Back
            </button>
            
            <button 
                onclick="window.location.href='/'"
                class="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
                Go to Homepage
            </button>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-500">
                If you continue to see this message, please contact support.
            </p>
        </div>
    </div>
    
    <script>
        // Auto-redirect after 10 seconds (optional)
        let countdown = 10;
        const countdownElement = document.createElement('p');
        countdownElement.className = 'text-sm text-gray-500 mt-4';
        countdownElement.innerHTML = `Redirecting in <span id="countdown">${countdown}</span> seconds...`;
        document.querySelector('.mt-6').appendChild(countdownElement);
        
        const countdownInterval = setInterval(() => {
            countdown--;
            document.getElementById('countdown').textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                window.history.back();
            }
        }, 1000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        });
    </script>
</body>
</html>
