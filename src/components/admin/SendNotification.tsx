import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getNotificationTypes } from '@/lib/api/notificationTypeApi'
import { createNotification } from '@/lib/api/notificationApi'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

export default function SendNotification() {
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined)

  const { data: notificationTypes } = useQuery({
    queryKey: ['notificationTypes'],
    queryFn: getNotificationTypes
  })

  const sendMutation = useMutation({
    mutationFn: () => createNotification({
      notificationType: selectedType,
      content,
      scheduledAt: scheduledAt?.toISOString()
    } as any),
    onSuccess: () => {
      toast({ 
        title: 'Notification sent successfully',
        description: 'The notification has been queued for delivery',
        variant: 'default'
      })
      setContent('')
      setSelectedType('')
      setScheduledAt(undefined)
    },
    onError: (error) => {
      toast({
        title: 'Failed to send notification',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Send Notification</h2>

      <form 
        onSubmit={(e) => {
          e.preventDefault()
          sendMutation.mutate()
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label>Notification Type</Label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select type</option>
            {notificationTypes?.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Schedule (optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {scheduledAt ? format(scheduledAt, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduledAt}
                onSelect={setScheduledAt}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" disabled={sendMutation.isPending}>
          Send Notification
        </Button>
      </form>
    </div>
  )
}
