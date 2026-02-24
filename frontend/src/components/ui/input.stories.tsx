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
  args: { placeholder: "Skriv något..." },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="din@email.com" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="pw">Lösenord</Label>
      <Input id="pw" type="password" placeholder="Minst 8 tecken" />
    </div>
  ),
};
