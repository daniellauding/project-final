import type { Meta, StoryObj } from "@storybook/react"

import { Text } from "./text"

const meta = {
  title: "UI/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["display", "h1", "h2", "h3", "h4", "h5", "h6", "body", "body-sm", "caption", "overline", "label"],
    },
    color: {
      control: "select",
      options: ["default", "muted", "primary", "secondary", "destructive", "success", "warning"],
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "This is body text",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-2xl">
      <Text variant="display" as="h1">Display Text</Text>
      <Text variant="h1" as="h1">Heading 1</Text>
      <Text variant="h2" as="h2">Heading 2</Text>
      <Text variant="h3" as="h3">Heading 3</Text>
      <Text variant="h4" as="h4">Heading 4</Text>
      <Text variant="h5" as="h5">Heading 5</Text>
      <Text variant="h6" as="h6">Heading 6</Text>
      <Text variant="body">Body text - regular paragraph content</Text>
      <Text variant="body-sm">Body small - smaller paragraph text</Text>
      <Text variant="caption">Caption text - helper or meta information</Text>
      <Text variant="overline">Overline Text</Text>
      <Text variant="label">Label Text</Text>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text color="default">Default color text</Text>
      <Text color="muted">Muted color text</Text>
      <Text color="primary">Primary color text</Text>
      <Text color="secondary">Secondary color text</Text>
      <Text color="destructive">Destructive color text</Text>
      <Text color="success">Success color text</Text>
      <Text color="warning">Warning color text</Text>
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
      <Text align="justify">
        Justified text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
    </div>
  ),
}

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text weight="normal">Normal weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </div>
  ),
}

export const Polymorphic: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text variant="h1" as="h1">Semantic H1 with h1 styling</Text>
      <Text variant="h2" as="div">Div with h2 styling</Text>
      <Text variant="body" as="span">Span with body styling</Text>
      <Text variant="label" as="label">Label element with label styling</Text>
      <Text variant="caption" as="p">Paragraph with caption styling</Text>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <article className="max-w-2xl">
      <Text variant="overline" color="primary">Blog Post</Text>
      <Text variant="h1" as="h1" className="mt-2">
        Building Modern Design Systems
      </Text>
      <Text variant="caption" color="muted" className="mt-2">
        Published on March 6, 2026 · 5 min read
      </Text>
      <Text variant="body" className="mt-6">
        Creating a design system is more than just defining colors and typography. 
        It's about establishing patterns, principles, and processes that help teams 
        build consistent user experiences.
      </Text>
      <Text variant="body" className="mt-4">
        In this article, we'll explore the key components of a modern design system 
        and how to implement them effectively.
      </Text>
      <Text variant="h2" as="h2" className="mt-8">
        Key Principles
      </Text>
      <Text variant="body" className="mt-4">
        Every great design system starts with clear principles that guide decision-making.
      </Text>
    </article>
  ),
}
