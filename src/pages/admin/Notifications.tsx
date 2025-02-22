import NotificationTypes from '@/components/admin/NotificationTypes'
import SendNotification from '@/components/admin/SendNotification'
import NotificationHistory from '@/components/admin/NotificationHistory'

export default function AdminNotifications() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <SendNotification />
      <NotificationTypes />
      <NotificationHistory />
    </div>
  )
}
