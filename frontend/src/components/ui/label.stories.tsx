import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Input } from "./input";

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

export const DarkMode: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="email-dark">Email</Label>
      <Input id="email-dark" type="email" />
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
