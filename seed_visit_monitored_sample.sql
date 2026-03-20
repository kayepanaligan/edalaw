-- Sample data for Visit Monitored Management module
-- Run this with: php artisan tinker --execute="DB::unprepared(file_get_contents('seed_visit_monitored_sample.sql'));"

INSERT INTO visit_monitored_logs (
    visit_id, meeting_id, room_id, jail_officer_id, visitor_id, 
    visitor_name, inmate_name, visit_type, session_started_at, 
    session_ended_at, duration_seconds, unique_participants_count, 
    participants, session_stats, traces, errors, status, notes, 
    created_at, updated_at
)
SELECT 
    NULL,
    CONCAT('MEET-', UPPER(SUBSTRING(MD5(RAND()), 1, 8))),
    CONCAT('ROOM-', UPPER(SUBSTRING(MD5(RAND()), 1, 6))),
    u.id as jail_officer_id,
    v.id as visitor_id,
    CONCAT(v.first_name, ' ', v.last_name),
    CONCAT('Inmate ', CHAR(65 + FLOOR(RAND() * 26))),
    IF(RAND() > 0.5, 'virtual', 'physical'),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
    DATE_ADD(DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY), INTERVAL FLOOR(RAND() * 7200 + 300) SECOND),
    FLOOR(RAND() * 7200 + 300),
    2,
    JSON_ARRAY(
        JSON_OBJECT(
            'id', CONCAT('participant_', FLOOR(RAND() * 1000)),
            'name', CONCAT(v.first_name, ' ', v.last_name),
            'role', 'visitor',
            'joined_at', DATE_FORMAT(DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 60) MINUTE), '%Y-%m-%dT%H:%i:%s+08:00'),
            'left_at', DATE_FORMAT(NOW(), '%Y-%m-%dT%H:%i:%s+08:00'),
            'duration_seconds', FLOOR(RAND() * 3600)
        )
    ),
    JSON_OBJECT(
        'chat_messages', FLOOR(RAND() * 100),
        'average_quality', FLOOR(RAND() * 30 + 70),
        'connection_drops', IF(RAND() > 0.8, FLOOR(RAND() * 5), 0)
    ),
    JSON_ARRAY(),
    JSON_ARRAY(),
    IF(RAND() > 0.7, IF(RAND() > 0.5, 'interrupted', 'failed'), 'completed'),
    NULL,
    NOW(),
    NOW()
FROM users u
CROSS JOIN (
    SELECT id, first_name, last_name 
    FROM users 
    WHERE role_id IN (SELECT id FROM roles WHERE slug = 'visitor')
    LIMIT 10
) v
WHERE u.role_id IN (SELECT id FROM roles WHERE slug = 'jail_officer')
LIMIT 20;
