import * as React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: string
  type: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target?: string
  timestamp: string | Date
  metadata?: Record<string, any>
}

export interface ActivityFeedProps {
  activities: ActivityItem[]
  showAvatar?: boolean
  className?: string
}

export function ActivityFeed({
  activities,
  showAvatar = true,
  className
}: ActivityFeedProps) {
  const formatTimestamp = (timestamp: string | Date) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    })
  }
  
  return (
    <Card className={cn("divide-y", className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="p-4">
          <div className="flex gap-4">
            {showAvatar && (
              <Avatar className="h-10 w-10 flex-shrink-0">
                {activity.user.avatar ? (
                  <img src={activity.user.avatar} alt={activity.user.name} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-white text-sm">
                    {activity.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user.name}</span>
                {" "}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.target && (
                  <>
                    {" "}
                    <span className="font-medium">"{activity.target}"</span>
                  </>
                )}
              </p>
              
              <p className="mt-1 text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </p>
              
              {activity.metadata?.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {activity.metadata.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {activities.length === 0 && (
        <div className="p-12 text-center text-sm text-muted-foreground">
          No recent activity
        </div>
      )}
    </Card>
  )
}
