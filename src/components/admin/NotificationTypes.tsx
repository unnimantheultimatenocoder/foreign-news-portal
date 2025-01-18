import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tables } from '@/integrations/supabase/types'
import {
  getNotificationTypes,
  createNotificationType,
  updateNotificationType,
  deleteNotificationType
} from '@/lib/api/notificationTypeApi'

export default function NotificationTypes() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  type EditType = {
    id?: string;
    name: string;
    description: string;
  }

  const [editType, setEditType] = useState<EditType>({
    name: '',
    description: ''
  })

  const { data: notificationTypes } = useQuery({
    queryKey: ['notificationTypes'],
    queryFn: getNotificationTypes
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<Tables<'notification_types'>, 'id' | 'created_at' | 'updated_at'>) => {
      const { id, ...rest } = data as any
      return createNotificationType(rest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationTypes'] })
      toast({ title: 'Notification type created successfully' })
      setEditType({ name: '', description: '' })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<EditType> }) =>
      updateNotificationType(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationTypes'] })
      toast({ title: 'Notification type updated successfully' })
      setEditType({ name: '', description: '' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationTypes'] })
      toast({ title: 'Notification type deleted successfully' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = editType
    if (id) {
      updateMutation.mutate({ id, updates: data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Notification Types</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={editType.name}
            onChange={(e) => setEditType({ ...editType, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={editType.description}
            onChange={(e) => setEditType({ ...editType, description: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {editType.id ? 'Update' : 'Create'} Type
        </Button>
      </form>

      <div className="space-y-4">
        {notificationTypes?.map((type) => (
          <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">{type.name}</h3>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditType(type)}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(type.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
