<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bypass Tunnel Code - Jail Officer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            width: 100%;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 48px 40px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }
        
        h1 {
            color: #1f2937;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            line-height: 1.3;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        
        .info-box {
            background: #fff7ed;
            color: #7c2d12;
            padding: 20px 24px;
            border-radius: 8px;
            border-left: 4px solid #ea580c;
            text-align: left;
            margin-bottom: 32px;
        }
        
        .info-box-title {
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 8px;
            color: #9a3412;
        }
        
        .info-box-text {
            font-size: 14px;
            line-height: 1.6;
            color: #7c2d12;
        }
        
        .success-message {
            background: #dcfce7;
            color: #166534;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #16a34a;
            margin-bottom: 24px;
            font-size: 14px;
        }
        
        .error-message {
            background: #fee2e2;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
            margin-bottom: 24px;
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        label {
            display: block;
            font-weight: 600;
            font-size: 14px;
            color: #374151;
            margin-bottom: 8px;
        }
        
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
            letter-spacing: 4px;
            text-align: center;
        }
        
        input[type="text"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #ea580c;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            width: 100%;
        }
        
        .btn-primary {
            background: #ea580c;
            color: white;
        }
        
        .btn-primary:hover {
            background: #c2410c;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            margin-top: 12px;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
        }
        
        .resend-link {
            text-align: center;
            margin-top: 16px;
            font-size: 14px;
        }
        
        .resend-link button {
            background: none;
            border: none;
            color: #ea580c;
            font-weight: 600;
            cursor: pointer;
            text-decoration: underline;
        }
        
        .resend-link button:hover {
            color: #c2410c;
        }
        
        .resend-link button:disabled {
            color: #9ca3af;
            cursor: not-allowed;
            text-decoration: none;
        }
        
        @media (max-width: 480px) {
            .card {
                padding: 36px 24px;
            }
            
            h1 {
                font-size: 22px;
            }
            
            .subtitle {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Jail Officer Bypass</h1>
            
            <p class="subtitle">
                A bypass code has been sent to the assigned jail officer via SMS.
            </p>
            
            @if(session('success'))
                <div class="success-message">
                    {{ session('success') }}
                </div>
            @endif
            
            @if($errors->has('otp'))
                <div class="error-message">
                    {{ $errors->first('otp') }}
                </div>
            @endif
            
            @if($errors->has('resend'))
                <div class="error-message">
                    {{ $errors->first('resend') }}
                </div>
            @endif
            
            <div class="info-box">
                <div class="info-box-title">Bypass Code Sent</div>
                <div class="info-box-text">
                    A 6-digit bypass code has been sent to 
                    <strong>{{ $jailOfficer->full_name }}</strong> 
                    at <strong>**** **** {{ substr($jailOfficer->contact_number, -4) }}</strong>.
                    <br><br>
                    Please enter the code below to reset the tunnel status and allow the PDL to join again.
                </div>
            </div>
            
            <form method="POST" action="{{ route('jail-officer.tunnel-bypass.verify-otp') }}">
                @csrf
                <input type="hidden" name="token" value="{{ $token }}">
                
                <div class="form-group">
                    <label for="otp">Enter 6-Digit Bypass Code</label>
                    <input 
                        type="text" 
                        id="otp" 
                        name="otp" 
                        placeholder="000000"
                        maxlength="6"
                        pattern="[0-9]{6}"
                        required
                        autofocus
                        autocomplete="off"
                    >
                </div>
                
                <button type="submit" class="btn btn-primary">
                    Verify Code & Reset Tunnel
                </button>
                
                <div class="resend-link">
                    <span>Didn't receive the code? </span>
                    <button type="button" id="resendBtn" onclick="resendOtp()">
                        Resend Code
                    </button>
                    <span id="countdown"></span>
                </div>
                
                <a href="/" class="btn btn-secondary">
                    Cancel
                </a>
            </form>
        </div>
    </div>
    
    <script>
        let cooldownSeconds = 120; // 2 minutes cooldown
        let cooldownActive = false;
        
        // Check if we should start cooldown from sessionStorage
        const lastResendTime = sessionStorage.getItem('bypass_resend_time');
        if (lastResendTime) {
            const elapsed = Math.floor((Date.now() - parseInt(lastResendTime)) / 1000);
            if (elapsed < cooldownSeconds) {
                startCooldown(cooldownSeconds - elapsed);
            }
        }
        
        function resendOtp() {
            if (cooldownActive) return;
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = "{{ route('jail-officer.tunnel-bypass.resend-otp') }}";
            
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'token';
            tokenInput.value = "{{ $token }}";
            
            form.appendChild(tokenInput);
            document.body.appendChild(form);
            form.submit();
            
            // Start cooldown
            startCooldown(cooldownSeconds);
            sessionStorage.setItem('bypass_resend_time', Date.now().toString());
        }
        
        function startCooldown(seconds) {
            cooldownActive = true;
            const resendBtn = document.getElementById('resendBtn');
            const countdownSpan = document.getElementById('countdown');
            resendBtn.disabled = true;
            
            let remaining = seconds;
            
            const interval = setInterval(() => {
                remaining--;
                
                if (remaining <= 0) {
                    clearInterval(interval);
                    cooldownActive = false;
                    resendBtn.disabled = false;
                    resendBtn.textContent = 'Resend Code';
                    countdownSpan.textContent = '';
                    sessionStorage.removeItem('bypass_resend_time');
                } else {
                    const mins = Math.floor(remaining / 60);
                    const secs = remaining % 60;
                    countdownSpan.textContent = `(${mins}:${secs.toString().padStart(2, '0')})`;
                }
            }, 1000);
        }
    </script>
</body>
</html>
