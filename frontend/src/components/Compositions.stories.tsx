import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { User, Lock, Mail, MessageSquare, Heart, Share2 } from "lucide-react";

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
        <p className="text-xs text-muted-foreground text-center">
          Don't have an account?{" "}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
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
              Help us choose the final design for the homepage hero section
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

export const UserProfileCard: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">Jane Doe</h3>
            <Badge variant="secondary">Pro</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">@janedoe</p>
          <p className="text-sm mb-4">
            Product designer passionate about creating delightful user
            experiences. Currently at Pejla.
          </p>
          <div className="flex gap-4 text-sm mb-4">
            <div>
              <span className="font-bold">42</span>{" "}
              <span className="text-muted-foreground">Polls</span>
            </div>
            <div>
              <span className="font-bold">1.2k</span>{" "}
              <span className="text-muted-foreground">Votes</span>
            </div>
            <div>
              <span className="font-bold">89</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
          <Button className="w-full">Follow</Button>
        </div>
      </div>
    </Card>
  ),
};

export const SettingsPanel: Story = {
  render: () => (
    <Card className="w-[600px]">
      <Tabs defaultValue="profile" className="p-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input id="display-name" defaultValue="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              defaultValue="Product designer passionate about UX"
              rows={3}
            />
          </div>
          <Button>Save Changes</Button>
        </TabsContent>
        <TabsContent value="account" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email-settings">Email</Label>
            <Input id="email-settings" type="email" defaultValue="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-settings">New Password</Label>
            <Input id="password-settings" type="password" />
          </div>
          <Button>Update Account</Button>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Notification settings will be displayed here.
          </p>
        </TabsContent>
      </Tabs>
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
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>project-brief.pdf</span>
            <span className="text-muted-foreground">23%</span>
          </div>
          <Progress value={23} />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          2 of 3 files uploaded successfully
        </p>
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
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  ),
};

export const DeleteConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Poll</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete your poll "Which design direction?" and
            all associated votes and comments. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm font-medium">Poll details:</p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• 124 votes collected</li>
            <li>• 18 comments</li>
            <li>• Created 3 days ago</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const NotificationToasts: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster />
      <Button
        onClick={() =>
          toast.success("Poll created!", {
            description: "Your poll is now live and ready for votes.",
          })
        }
      >
        Poll Created
      </Button>
      <Button
        onClick={() =>
          toast("New vote received", {
            description: "Someone just voted on your poll.",
            action: {
              label: "View",
              onClick: () => console.log("View clicked"),
            },
          })
        }
      >
        New Vote
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Upload failed", {
            description: "File size exceeds 5MB limit.",
          })
        }
      >
        Upload Error
      </Button>
    </div>
  ),
};
