import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Asterisk } from "lucide-react";

const meta: Meta<typeof Label> = {
  title: "UI/Forms/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Email",
    htmlFor: "email",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="message">Your Message</Label>
      <Textarea id="message" placeholder="Tell us what you think..." />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="username">
        Username
        <Asterisk className="h-3 w-3 text-destructive" />
      </Label>
      <Input id="username" required />
    </div>
  ),
};

export const WithHelpText: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" />
      <p className="text-xs text-muted-foreground">
        Must be at least 8 characters long
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-96 space-y-2" data-disabled="true">
      <Label htmlFor="disabled-input">Disabled Field</Label>
      <Input id="disabled-input" disabled placeholder="Cannot edit" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="w-96 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name
          <Asterisk className="h-3 w-3 text-destructive" />
        </Label>
        <Input id="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-form">
          Email
          <Asterisk className="h-3 w-3 text-destructive" />
        </Label>
        <Input id="email-form" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" placeholder="Tell us about yourself..." />
        <p className="text-xs text-muted-foreground">Optional</p>
      </div>
    </form>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-dark">Email</Label>
        <Input id="email-dark" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message-dark">Message</Label>
        <Textarea id="message-dark" />
      </div>
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
