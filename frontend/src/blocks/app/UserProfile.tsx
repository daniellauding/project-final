import * as React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface UserProfileProps {
  user: {
    name: string
    username?: string
    bio?: string
    location?: string
    website?: string
    avatar?: string
    coverImage?: string
  }
  stats?: Array<{
    label: string
    value: string | number
  }>
  actions?: Array<{
    label: string
    variant?: "default" | "outline" | "ghost"
    onClick?: () => void
    href?: string
  }>
  className?: string
}

export function UserProfile({
  user,
  stats,
  actions,
  className
}: UserProfileProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Cover Image */}
      {user.coverImage && (
        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-600">
          <img
            src={user.coverImage}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {!user.coverImage && (
        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-600" />
      )}
      
      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar */}
          <div className="-mt-12 sm:-mt-16">
            <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-white text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="mt-4 flex gap-2 sm:mt-0">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  size="sm"
                  asChild={!!action.href}
                  onClick={action.onClick}
                >
                  {action.href ? (
                    <a href={action.href}>{action.label}</a>
                  ) : (
                    action.label
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          {user.username && (
            <p className="text-muted-foreground">@{user.username}</p>
          )}
          
          {user.bio && (
            <p className="mt-3 text-sm text-foreground">{user.bio}</p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1">
                📍 {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary"
              >
                🔗 {user.website.replace(/^https?:\/\//,"")}
              </a>
            )}
          </div>
        </div>
        
        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mt-6 flex gap-6 border-t pt-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
