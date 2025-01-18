import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

export async function getNotificationTypes(): Promise<Tables<'notification_types'>[]> {
  const { data, error } = await supabase
    .from('notification_types')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function createNotificationType(type: Omit<Tables<'notification_types'>, 'id'>) {
  const { data, error } = await supabase
    .from('notification_types')
    .insert(type)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNotificationType(
  id: string,
  updates: Partial<Tables<'notification_types'>>
) {
  const { data, error } = await supabase
    .from('notification_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNotificationType(id: string) {
  const { error } = await supabase
    .from('notification_types')
    .delete()
    .eq('id', id)

  if (error) throw error
}
