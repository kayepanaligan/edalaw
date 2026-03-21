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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            max-width: 500px;
            width: 100%;
        }
        
        .card {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
        }
        
        .icon {
            font-size: 64px;
            margin-bottom: 24px;
        }
        
        h1 {
            color: #1f2937;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            line-height: 1.3;
        }
        
        p {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        
        .highlight {
            background: #fef3c7;
            color: #92400e;
            padding: 16px 20px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            text-align: left;
            margin-bottom: 32px;
            font-size: 14px;
        }
        
        .highlight strong {
            display: block;
            margin-bottom: 8px;
            color: #78350f;
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
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
        }
        
        .btn-primary {
            background: #2563eb;
            color: white;
        }
        
        .btn-primary:hover {
            background: #1d4ed8;
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
        }
        
        @media (max-width: 480px) {
            .card {
                padding: 32px 24px;
            }
            
            h1 {
                font-size: 20px;
            }
            
            p {
                font-size: 14px;
            }
            
            .icon {
                font-size: 48px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="icon">🚫</div>
            
            <h1>Tunnel Code Already Used</h1>
            
            <p>
                This PDL tunnel code has already been used to join the session. 
                Each tunnel code can only be used once for security purposes.
            </p>
            
            <div class="highlight">
                <strong>What happened?</strong>
                The tunnel link you're trying to access has already been used by another inmate. 
                This is a security measure to prevent unauthorized access to video call sessions.
            </div>
            
            <div class="actions">
                <a href="/" class="btn btn-secondary">
                    ← Go Home
                </a>
                <button onclick="contactAdmin()" class="btn btn-primary">
                    📧 Contact Administrator
                </button>
            </div>
        </div>
    </div>
    
    <script>
        function contactAdmin() {
            // You can customize this with your actual admin contact
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
