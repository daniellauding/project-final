import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Forms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="message">Your Message</Label>
      <Textarea id="message" placeholder="Tell us what you think..." />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "This is some pre-filled content that can be edited.",
  },
};

export const Invalid: Story = {
  args: {
    placeholder: "This field has an error",
    "aria-invalid": true,
  },
};

export const LongContent: Story = {
  args: {
    defaultValue: `This is a longer piece of text that demonstrates how the textarea handles multiple lines of content.

It can include paragraphs, line breaks, and all sorts of formatting.

The textarea will automatically expand to fit the content.`,
  },
};

export const DarkMode: Story = {
  args: {
    placeholder: "Dark mode textarea",
  },
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
