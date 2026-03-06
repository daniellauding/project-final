import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Check, X, AlertCircle, Star } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "UI/Display/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <Check className="mr-1" />
        Success
      </Badge>
      <Badge variant="destructive">
        <X className="mr-1" />
        Error
      </Badge>
      <Badge variant="outline">
        <AlertCircle className="mr-1" />
        Warning
      </Badge>
      <Badge variant="secondary">
        <Star className="mr-1" />
        Featured
      </Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Draft</Badge>
      <Badge>Active</Badge>
      <Badge variant="secondary">In Review</Badge>
      <Badge variant="destructive">Closed</Badge>
    </div>
  ),
};

export const CountBadges: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span>Notifications</span>
        <Badge>3</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Messages</span>
        <Badge variant="destructive">12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Updates</span>
        <Badge variant="secondary">99+</Badge>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
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
