-- Enable RLS and create policies for notification_types
ALTER TABLE notification_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage notification types" 
ON notification_types 
FOR ALL 
TO authenticated 
USING (is_admin(auth.uid())) 
WITH CHECK (is_admin(auth.uid()));

-- Enable RLS and create policies for notification_logs
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own notification logs
CREATE POLICY "Users can read their own notification logs"
ON notification_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admin can manage all notification logs
CREATE POLICY "Admin can manage all notification logs"
ON notification_logs
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Enable RLS and create policies for notification_schedules
ALTER TABLE notification_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage notification schedules"
ON notification_schedules
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create helper function for admin check
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
