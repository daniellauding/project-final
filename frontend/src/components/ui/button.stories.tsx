import type { Meta, StoryObj } from "@storybook/react"
import { Search, ArrowRight, Download, Settings, Check, Plus, ChevronDown, Mail } from "lucide-react"

import { Button, ButtonIcon } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "tertiary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    loading: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Button",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithLeadingIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <ButtonIcon slot="leading">
          <Search className="size-4" />
        </ButtonIcon>
        Search
      </Button>
      <Button variant="outline">
        <ButtonIcon slot="leading">
          <Download className="size-4" />
        </ButtonIcon>
        Download
      </Button>
      <Button variant="secondary">
        <ButtonIcon slot="leading">
          <Plus className="size-4" />
        </ButtonIcon>
        Add Item
      </Button>
    </div>
  ),
}

export const WithTrailingIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        Next
        <ButtonIcon slot="trailing">
          <ArrowRight className="size-4" />
        </ButtonIcon>
      </Button>
      <Button variant="outline">
        Open Menu
        <ButtonIcon slot="trailing">
          <ChevronDown className="size-4" />
        </ButtonIcon>
      </Button>
    </div>
  ),
}

export const WithBothIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <ButtonIcon slot="leading">
          <Mail className="size-4" />
        </ButtonIcon>
        Send Email
        <ButtonIcon slot="trailing">
          <ArrowRight className="size-4" />
        </ButtonIcon>
      </Button>
      <Button variant="secondary">
        <ButtonIcon slot="leading">
          <Check className="size-4" />
        </ButtonIcon>
        Confirm
        <ButtonIcon slot="trailing">
          <ArrowRight className="size-4" />
        </ButtonIcon>
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button size="icon">
        <Settings className="size-4" />
      </Button>
      <Button size="icon" variant="outline">
        <Search className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost">
        <Plus className="size-4" />
      </Button>
      <Button size="icon-lg">
        <Download className="size-5" />
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Loading...</Button>
      <Button loading variant="outline">
        Saving...
      </Button>
      <Button loading loadingText="Please wait...">
        Submit
      </Button>
      <Button loading variant="secondary" loadingText="Processing">
        Process Data
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled</Button>
      <Button disabled variant="outline">
        Disabled Outline
      </Button>
      <Button disabled variant="destructive">
        Disabled Destructive
      </Button>
    </div>
  ),
}

export const AsChild: Story = {
  render: () => (
    <Button asChild>
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        Visit Website
      </a>
    </Button>
  ),
}
