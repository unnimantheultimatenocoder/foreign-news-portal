import { supabase } from '@/integrations/supabase/client'

export interface NotificationType {
  id: string
  name: string
  description: string
}

export interface CreateNotificationParams {
  notificationType: string
  content: string
  scheduledAt: string
}

export async function getNotificationTypes(): Promise<NotificationType[]> {
  const { data, error } = await supabase
    .from('notification_types')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export interface NotificationLog {
  id: string
  user_id: string
  notification_id: string
  sent_at: string
  delivered_at: string | null
  read_at: string | null
  created_at: string
}

export interface NotificationSchedule {
  id: string
  notification_type_id: string
  scheduled_at: string
  status: string
  created_at: string
  updated_at: string
}

export async function getNotificationLogs(): Promise<NotificationLog[]> {
  const { data, error } = await supabase
    .from('notification_logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNotificationSchedules(): Promise<NotificationSchedule[]> {
  const { data, error } = await supabase
    .from('notification_schedules')
    .select('*')
    .order('scheduled_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createNotification(params: CreateNotificationParams) {
  const { error } = await supabase.functions.invoke('send-push-notification', {
    body: params
  })

  if (error) throw error
}
