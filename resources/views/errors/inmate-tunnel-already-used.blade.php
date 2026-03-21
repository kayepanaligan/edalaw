<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tunnel Code Already Used</title>
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
            text-align: center;
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
        
        .security-note {
            background: #f3f4f6;
            padding: 20px 24px;
            border-radius: 8px;
            margin-bottom: 32px;
        }
        
        .security-note-title {
            font-weight: 600;
            font-size: 14px;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .security-note-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
        }
        
        .actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
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
            min-width: 160px;
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
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
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
            
            .info-box,
            .security-note {
                padding: 16px 18px;
            }
            
            .actions {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Tunnel Code Already Used</h1>
            
            <p class="subtitle">
                This PDL tunnel code has already been used to join the session. 
                Each tunnel code can only be used once for security purposes.
            </p>
            
            <div class="info-box">
                <div class="info-box-title">What happened?</div>
                <div class="info-box-text">
                    The tunnel link you're trying to access has already been used by another inmate. 
                    This is a security measure to prevent unauthorized access to video call sessions.
                </div>
            </div>
            
            <div class="security-note">
                <div class="security-note-title">Security Notice</div>
                <div class="security-note-text">
                    Tunnel codes are single-use to ensure that only authorized individuals can access 
                    their scheduled video call sessions. This prevents sharing of links and maintains 
                    the integrity of the visitation system.
                </div>
            </div>
            
            <div class="actions">
                <a href="/" class="btn btn-secondary">
                    Go to Homepage
                </a>
                <button onclick="contactAdmin()" class="btn btn-primary">
                    Contact Administrator
                </button>
            </div>
        </div>
    </div>
    
    <script>
        function contactAdmin() {
            const adminEmail = 'admin@edalaw.gov.ph';
            const subject = encodeURIComponent('PDL Tunnel Code Issue - Already Used');
            const body = encodeURIComponent(
                'Hello,\n\nI am experiencing an issue with my PDL tunnel code. ' +
                'When I tried to join my scheduled session, I received a message that the code has already been used.\n\n' +
                'Please help me resolve this issue.\n\n' +
                'Thank you.'
            );
            
            window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
        }
    </script>
</body>
</html>
