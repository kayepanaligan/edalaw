<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Chat export – Session #{{ $session->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10pt; margin: 1em; }
        h1 { font-size: 14pt; }
        .message { margin-bottom: 0.75em; border-bottom: 1px solid #eee; padding-bottom: 0.5em; }
        .sender { font-weight: bold; color: #333; }
        .time { color: #666; font-size: 9pt; }
        .flagged { color: #c00; font-style: italic; }
    </style>
</head>
<body>
    <h1>Chat export – Visit Session #{{ $session->id }}</h1>
    <p>Generated at {{ now()->format('Y-m-d H:i:s') }}</p>
    <hr>

    @foreach($messages as $log)
        <div class="message">
            <span class="sender">{{ ucfirst($log->sender) }}</span>
            <span class="time"> – {{ $log->sent_at->format('Y-m-d H:i:s') }}</span>
            @if($log->flagged)
                <span class="flagged"> [Flagged]</span>
            @endif
            <br>
            {{ $log->message }}
            @if($log->flagged && $log->flag_reason)
                <br><span class="flagged">Reason: {{ $log->flag_reason }}</span>
            @endif
        </div>
    @endforeach

    @if($messages->isEmpty())
        <p>No messages in this session.</p>
    @endif
</body>
</html>
