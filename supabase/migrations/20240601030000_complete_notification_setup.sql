-- 1. Create notification_types table
CREATE TABLE notification_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create notification_schedules table
CREATE TABLE notification_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type_id UUID NOT NULL REFERENCES notification_types(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Modify existing notifications table
ALTER TABLE notifications
ADD COLUMN notification_type_id UUID REFERENCES notification_types(id),
ADD COLUMN delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed')),
ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type_id);
CREATE INDEX IF NOT EXISTS idx_notification_schedules_status_scheduled_at ON notification_schedules(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notification_schedules_notification_type_id ON notification_schedules(notification_type_id);

-- 5. Enable RLS and create policies

-- For notification_types
ALTER TABLE notification_types ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can manage notification types
CREATE POLICY "Admin can manage notification types" 
ON notification_types 
FOR ALL 
TO authenticated 
USING (is_admin(auth.uid())) 
WITH CHECK (is_admin(auth.uid()));

-- For notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read their own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Admin can manage all notifications
CREATE POLICY "Admin can manage all notifications"
ON notifications
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- For notification_schedules
ALTER TABLE notification_schedules ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can manage notification schedules
CREATE POLICY "Admin can manage notification schedules"
ON notification_schedules
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 5. Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notification_types_name ON notification_types(name);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_article_id ON notifications(article_id);
