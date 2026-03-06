import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { 
  Search, 
  Mail, 
  Lock, 
  User, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  ArrowRight,
  Check,
  Settings,
  Bell,
  LogOut
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardActions, CardMedia, CardAction } from "./ui/card"
import { Button, ButtonIcon } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Text } from "./ui/text"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "./ui/avatar"
import { Badge } from "./ui/badge"

const meta = {
  title: "Compositions/v2 Patterns",
  parameters: {
    layout: "padded",
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const LoginForm: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20">
        <Card elevation="floating" className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              label="Email" 
              type="email"
              prefix={<Mail className="size-4" />}
              placeholder="you@example.com"
              required
            />
            <Input 
              label="Password" 
              type="password"
              prefix={<Lock className="size-4" />}
              placeholder="••••••••"
              required
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button 
              className="w-full" 
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 2000)
              }}
            >
              Sign In
              <ButtonIcon slot="trailing">
                <ArrowRight className="size-4" />
              </ButtonIcon>
            </Button>
            <Button variant="link" className="text-sm">
              Forgot password?
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  },
}

export const PollCardInteractive: Story = {
  render: () => {
    const [voted, setVoted] = useState(false)
    
    return (
      <div className="max-w-xl mx-auto p-4">
        <Card 
          elevation="raised" 
          interactive 
          onPress={() => !voted && console.log("Open poll")}
        >
          <CardMedia>
            <img 
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=300&fit=crop" 
              alt="Poll" 
              className="w-full h-48 object-cover"
            />
          </CardMedia>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle>Design A vs Design B</CardTitle>
                <CardDescription>Posted by John Doe · 2 days ago</CardDescription>
              </div>
            </div>
            <CardAction>
              <Button size="icon-sm" variant="ghost">
                <MoreVertical className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Text variant="body">
              Which design do you prefer for our new landing page? Vote now and help us decide!
            </Text>
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary">Design</Badge>
              <Badge variant="secondary">UX</Badge>
              <Badge variant="secondary">Poll</Badge>
            </div>
          </CardContent>
          <CardActions>
            <Button 
              size="sm" 
              variant={voted ? "default" : "ghost"}
              loading={voted}
              loadingText="Voted"
              onClick={(e) => {
                e.stopPropagation()
                setVoted(true)
                setTimeout(() => setVoted(false), 2000)
              }}
            >
              <ButtonIcon slot="leading">
                <ThumbsUp className="size-4" />
              </ButtonIcon>
              {voted ? "1,235" : "1,234"} Votes
            </Button>
            <Button size="sm" variant="ghost">
              <ButtonIcon slot="leading">
                <MessageCircle className="size-4" />
              </ButtonIcon>
              45 Comments
            </Button>
            <Button size="sm" variant="ghost">
              <ButtonIcon slot="leading">
                <Share2 className="size-4" />
              </ButtonIcon>
              Share
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  },
}

export const CommentForm: Story = {
  render: () => {
    const [submitting, setSubmitting] = useState(false)
    
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card elevation="raised">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="You" />
                <AvatarFallback>YO</AvatarFallback>
                <AvatarBadge className="bg-green-500" />
              </Avatar>
              <div>
                <Text variant="label">Add a Comment</Text>
                <Text variant="caption" color="muted">Share your thoughts</Text>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Write your comment here..."
              loading={submitting}
              rows={4}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                <Settings className="size-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button 
                size="sm"
                loading={submitting}
                onClick={() => {
                  setSubmitting(true)
                  setTimeout(() => setSubmitting(false), 2000)
                }}
              >
                <ButtonIcon slot="leading">
                  <Check className="size-4" />
                </ButtonIcon>
                Post Comment
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  },
}

export const UserProfile: Story = {
  render: () => (
    <div className="max-w-md mx-auto p-4">
      <Card elevation="floating">
        <CardMedia>
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
        </CardMedia>
        <CardContent className="relative">
          <Avatar size="lg" className="absolute -top-12 left-6 ring-4 ring-background">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
            <AvatarBadge className="bg-green-500" />
          </Avatar>
          <div className="pt-8">
            <Text variant="h3" as="h2">John Doe</Text>
            <Text variant="body-sm" color="muted">@johndoe</Text>
            <Text variant="body" className="mt-4">
              Product designer passionate about creating beautiful and functional user experiences.
            </Text>
            <div className="flex gap-2 mt-4">
              <Badge>Designer</Badge>
              <Badge variant="secondary">Remote</Badge>
              <Badge variant="outline">Available</Badge>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button size="sm" className="flex-1">
            <ButtonIcon slot="leading">
              <Mail className="size-4" />
            </ButtonIcon>
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <ButtonIcon slot="leading">
              <User className="size-4" />
            </ButtonIcon>
            Follow
          </Button>
        </CardActions>
      </Card>
    </div>
  ),
}

export const SearchBar: Story = {
  render: () => {
    const [searching, setSearching] = useState(false)
    
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card elevation="floating">
          <CardContent className="p-0">
            <Input 
              placeholder="Search polls, users, or topics..."
              prefix={<Search className="size-4" />}
              loading={searching}
              className="border-0 shadow-none focus-visible:ring-0"
              onChange={() => {
                setSearching(true)
                setTimeout(() => setSearching(false), 1000)
              }}
            />
          </CardContent>
        </Card>
      </div>
    )
  },
}

export const NotificationCard: Story = {
  render: () => (
    <div className="max-w-md mx-auto p-4 space-y-2">
      <Card elevation="flat" interactive onPress={() => console.log("Notification clicked")}>
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Avatar size="sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Text variant="body-sm">
                <Text as="span" weight="semibold">John Doe</Text>
                {" "}voted on your poll
              </Text>
              <Text variant="caption" color="muted">2 minutes ago</Text>
            </div>
            <Badge variant="default" className="h-2 w-2 p-0 shrink-0" />
          </div>
        </CardContent>
      </Card>
      
      <Card elevation="flat" interactive onPress={() => console.log("Notification clicked")}>
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Avatar size="sm">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Text variant="body-sm">
                <Text as="span" weight="semibold">Jane Smith</Text>
                {" "}commented on your poll
              </Text>
              <Text variant="caption" color="muted">5 hours ago</Text>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

export const DashboardHeader: Story = {
  render: () => (
    <div className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Text variant="h4" as="h1">Dashboard</Text>
            <Badge variant="secondary">12 Active Polls</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Quick search..."
              prefix={<Search className="size-4" />}
              className="w-64"
            />
            <Button size="icon" variant="ghost">
              <Bell className="size-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="size-4" />
            </Button>
            <Avatar size="sm" className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>YO</AvatarFallback>
              <AvatarBadge className="bg-green-500" />
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  ),
}
