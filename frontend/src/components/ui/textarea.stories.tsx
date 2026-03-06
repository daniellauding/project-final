import type { Meta, StoryObj } from "@storybook/react"

import { Textarea } from "./textarea"

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-96">
      <Textarea 
        label="Message" 
        placeholder="Write your message here..."
      />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="w-96">
      <Textarea 
        label="Bio" 
        description="Tell us a bit about yourself (max 500 characters)"
        placeholder="I am a designer who loves..."
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-96">
      <Textarea 
        label="Comment" 
        error="Comment must be at least 10 characters"
        defaultValue="Too short"
      />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-96">
      <Textarea 
        label="Feedback" 
        required
        placeholder="Your feedback is important to us..."
      />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-96">
      <Textarea 
        label="AI Response" 
        loading
        placeholder="Generating response..."
        defaultValue="The AI is thinking..."
      />
    </div>
  ),
}

export const Complete: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[500px]">
      <Textarea 
        label="Description" 
        description="Provide a detailed description (min 50 characters)"
        placeholder="Enter description..."
        required
      />
      
      <Textarea 
        label="Additional Notes" 
        description="Optional notes for the team"
        placeholder="Add any additional context..."
      />
      
      <Textarea 
        label="Invalid Input" 
        error="This field cannot be empty"
        defaultValue=""
      />
      
      <Textarea 
        label="Processing" 
        loading
        defaultValue="Analyzing your input..."
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <Textarea 
        label="Read Only" 
        disabled
        defaultValue="This content cannot be edited."
      />
    </div>
  ),
}
