import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card } from "./card";
import { User, Bell, Settings } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "UI/Layout/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="p-4">
          <p className="text-sm">Make changes to your account here.</p>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="p-4">
          <p className="text-sm">Change your password here.</p>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card className="p-4">
          <p className="text-sm">Manage your settings here.</p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4">
          <p className="text-sm">Overview content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4">
          <p className="text-sm">Analytics content goes here.</p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="p-4">
          <p className="text-sm">Reports content goes here.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="profile">
          <User />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card className="p-4">
          <p className="text-sm">Your profile information.</p>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card className="p-4">
          <p className="text-sm">Notification preferences.</p>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card className="p-4">
          <p className="text-sm">Application settings.</p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">General Settings</h3>
          <p className="text-sm">Configure your general preferences.</p>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Security Settings</h3>
          <p className="text-sm">Manage your security options.</p>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Notification Settings</h3>
          <p className="text-sm">Control notification preferences.</p>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Billing Settings</h3>
          <p className="text-sm">View and manage billing information.</p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="available" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <Card className="p-4">
          <p className="text-sm">This tab is available.</p>
        </Card>
      </TabsContent>
      <TabsContent value="disabled">
        <Card className="p-4">
          <p className="text-sm">This content is not accessible.</p>
        </Card>
      </TabsContent>
      <TabsContent value="other">
        <Card className="p-4">
          <p className="text-sm">Another available tab.</p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Card className="p-4">
          <p className="text-sm">Content for tab 1.</p>
        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card className="p-4">
          <p className="text-sm">Content for tab 2.</p>
        </Card>
      </TabsContent>
      <TabsContent value="tab3">
        <Card className="p-4">
          <p className="text-sm">Content for tab 3.</p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" className="p-8">
        <Story />
      </div>
    ),
  ],
};
