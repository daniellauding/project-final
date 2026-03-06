import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Type something..." },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@email.com" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="pw">Password</Label>
      <Input id="pw" type="password" placeholder="At least 8 characters" />
    </div>
  ),
};
