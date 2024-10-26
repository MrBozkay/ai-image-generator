'use client'

import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

export function Notifications() {
  const { toast } = useToast()

  const showNotification = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    toast({
      variant,
      title,
      description,
      action: <ToastAction altText="Close">Close</ToastAction>,
    })
  }

  return <Toaster />
}

export { useToast }