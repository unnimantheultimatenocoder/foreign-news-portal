import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get notification data from request
    const { notificationType, content, scheduledAt } = await req.json()

    // Verify notification type exists
    const { data: notificationTypeData } = await supabase
      .from('notification_types')
      .select('*')
      .eq('name', notificationType)
      .single()

    if (!notificationTypeData) {
      return new Response(
        JSON.stringify({ error: 'Invalid notification type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get users who have enabled this notification type
    const { data: userPreferences } = await supabase
      .from('user_notification_preferences')
      .select('user_id')
      .eq('notification_type_id', notificationTypeData.id)
      .eq('enabled', true)

    if (!userPreferences || userPreferences.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No users found for this notification type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create notification records
    const notifications = userPreferences.map(user => ({
      user_id: user.user_id,
      notification_type_id: notificationTypeData.id,
      content,
      scheduled_at: scheduledAt || new Date().toISOString(),
      delivery_status: 'pending'
    }))

    // Insert notifications for each user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select()

    if (notificationError) {
      throw notificationError
    }

    return new Response(
      JSON.stringify({ message: 'Notifications sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
