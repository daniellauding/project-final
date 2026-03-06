import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Vote, PlusCircle, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Click here" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button><Vote className="mr-2 h-4 w-4" />Vote</Button>
      <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />New poll</Button>
      <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
