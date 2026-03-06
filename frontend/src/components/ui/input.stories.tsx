import type { Meta, StoryObj } from "@storybook/react"
import { Search, Mail, Lock, User, DollarSign } from "lucide-react"

import { Input } from "./input"
import { Button } from "./button"

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80">
      <Input 
        label="Email" 
        type="email"
        placeholder="you@example.com" 
      />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="w-80">
      <Input 
        label="Username" 
        description="Choose a unique username for your account"
        placeholder="johndoe" 
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <Input 
        label="Email" 
        type="email"
        error="Please enter a valid email address"
        defaultValue="invalid@"
      />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-80">
      <Input 
        label="Full Name" 
        required
        placeholder="Enter your full name" 
      />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input 
        label="Search" 
        loading
        placeholder="Searching..." 
      />
      <Input 
        label="Email" 
        loading
        defaultValue="checking@example.com"
      />
    </div>
  ),
}

export const WithPrefix: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input 
        label="Search" 
        prefix={<Search className="size-4" />}
        placeholder="Search..." 
      />
      <Input 
        label="Email" 
        prefix={<Mail className="size-4" />}
        type="email"
        placeholder="you@example.com" 
      />
      <Input 
        label="Username" 
        prefix={<User className="size-4" />}
        placeholder="johndoe" 
      />
    </div>
  ),
}

export const WithSuffix: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input 
        label="Amount" 
        suffix="USD"
        type="number"
        placeholder="0.00" 
      />
      <Input 
        label="Website" 
        suffix={<Button size="xs">Verify</Button>}
        placeholder="example.com" 
      />
    </div>
  ),
}

export const Complete: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <Input 
        label="Email Address" 
        description="We'll never share your email with anyone"
        type="email"
        prefix={<Mail className="size-4" />}
        placeholder="you@example.com"
        required
      />
      
      <Input 
        label="Password" 
        description="Must be at least 8 characters"
        type="password"
        prefix={<Lock className="size-4" />}
        placeholder="••••••••"
        required
      />
      
      <Input 
        label="Invite Code" 
        description="Enter the code you received"
        suffix={<Button size="xs">Apply</Button>}
        placeholder="XXXXX-XXXXX"
      />
      
      <Input 
        label="Current Email" 
        type="email"
        error="This email is already in use"
        prefix={<Mail className="size-4" />}
        defaultValue="taken@example.com"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Input 
        label="Disabled Input" 
        disabled
        placeholder="Cannot edit"
        defaultValue="Read only value"
      />
    </div>
  ),
}
