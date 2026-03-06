import type { Meta, StoryObj } from "@storybook/react"
import { User } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "./avatar"

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://broken-image.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar loading>
        <AvatarFallback loading />
      </Avatar>
      <Avatar size="lg" loading>
        <AvatarFallback loading />
      </Avatar>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>U4</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const Complete: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-4">Online Users</h3>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="John" />
            <AvatarFallback>JD</AvatarFallback>
            <AvatarBadge className="bg-green-500" />
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="Jane" />
            <AvatarFallback>JS</AvatarFallback>
            <AvatarBadge className="bg-green-500" />
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
            <AvatarBadge className="bg-green-500" />
          </Avatar>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-4">Loading Users</h3>
        <div className="flex items-center gap-4">
          <Avatar loading>
            <AvatarFallback loading />
          </Avatar>
          <Avatar loading>
            <AvatarFallback loading />
          </Avatar>
          <Avatar loading>
            <AvatarFallback loading />
          </Avatar>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-4">Team Members (8)</h3>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  ),
}
