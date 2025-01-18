import { useQuery } from '@tanstack/react-query'
import { getNotificationLogs, getNotificationSchedules } from '@/lib/api/notificationApi'
import { format } from 'date-fns'

export default function NotificationHistory() {
  const { data: logs } = useQuery({
    queryKey: ['notificationLogs'],
    queryFn: getNotificationLogs
  })

  const { data: schedules } = useQuery({
    queryKey: ['notificationSchedules'],
    queryFn: getNotificationSchedules
  })

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Notification History</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sent Notifications</h3>
        {logs?.map((log) => (
          <div key={log.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Sent: {format(new Date(log.sent_at), 'PPPp')}
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Status: {log.delivered_at ? 'Delivered' : 'Pending'} 
              {log.read_at && ' • Read'}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Scheduled Notifications</h3>
        {schedules?.map((schedule) => (
          <div key={schedule.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Scheduled for: {format(new Date(schedule.scheduled_at), 'PPPp')}
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Status: {schedule.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
