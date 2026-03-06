import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Mail, Lock, Heart, MessageSquare, Share2 } from "lucide-react";

const meta: Meta = {
  title: "Compositions/Real-world Examples",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const LoginForm: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome back</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="h-3 w-3" />
            Email
          </Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">
            <Lock className="h-3 w-3" />
            Password
          </Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full">Sign In</Button>
      </div>
    </Card>
  ),
};

export const PollCard: Story = {
  render: () => (
    <Card className="w-96 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=200&fit=crop"
        alt="Poll option"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Which design direction?
            </h3>
            <p className="text-sm text-muted-foreground">
              Help us choose the final design
            </p>
          </div>
          <Badge>Active</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>124 votes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>18 comments</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">John Doe</p>
            <p className="text-muted-foreground">Posted 2 hours ago</p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1">Vote</Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  ),
};

export const UploadProgress: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <h3 className="font-semibold mb-4">Uploading files</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>design-mockup.fig</span>
            <span className="text-muted-foreground">100%</span>
          </div>
          <Progress value={100} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>screenshot.png</span>
            <span className="text-muted-foreground">67%</span>
          </div>
          <Progress value={67} />
        </div>
      </div>
    </Card>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </Card>
  ),
};
