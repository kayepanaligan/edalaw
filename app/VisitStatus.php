<?php

namespace App;

enum VisitStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Missed = 'missed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
