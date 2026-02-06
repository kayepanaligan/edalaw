<?php

namespace App;

enum SuggestionStatus: string
{
    case Pending = 'pending';
    case Reviewed = 'reviewed';
    case InProgress = 'in_progress';
    case Resolved = 'resolved';
    case Dismissed = 'dismissed';
}
