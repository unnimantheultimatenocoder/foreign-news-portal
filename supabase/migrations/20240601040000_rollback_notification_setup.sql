-- 1. Drop indexes
DROP INDEX IF EXISTS idx_notifications_type;
DROP INDEX IF EXISTS idx_notifications_user_id_created_at;
DROP INDEX IF EXISTS idx_notifications_article_id;
DROP INDEX IF EXISTS idx_notification_types_name;
DROP INDEX IF EXISTS idx_notification_schedules_status_scheduled_at;
DROP INDEX IF EXISTS idx_notification_schedules_notification_type_id;
DROP INDEX IF EXISTS idx_notifications_user_id_created_at;
DROP INDEX IF EXISTS idx_notifications_article_id;

-- 2. Remove RLS policies and disable RLS
DROP POLICY IF EXISTS "Admin can manage notification types" ON notification_types;
DROP POLICY IF EXISTS "Users can read their own notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can manage all notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can manage notification schedules" ON notification_schedules;

ALTER TABLE notification_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_schedules DISABLE ROW LEVEL SECURITY;

-- 3. Drop helper function
DROP FUNCTION IF EXISTS is_admin;

-- 4. Revert notifications table modifications
ALTER TABLE notifications
DROP COLUMN IF EXISTS notification_type_id,
DROP COLUMN IF EXISTS delivery_status,
DROP COLUMN IF EXISTS scheduled_at;

-- 5. Drop notification_schedules table
DROP TABLE IF EXISTS notification_schedules CASCADE;

-- 6. Drop notification_types table
DROP TABLE IF EXISTS notification_types CASCADE;

-- 7. Remove edge function (if needed)
DROP FUNCTION IF EXISTS send_push_notification;
