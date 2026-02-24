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
  args: { children: "Klicka här" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Ta bort" },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button><Vote className="mr-2 h-4 w-4" />Rösta</Button>
      <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Ny poll</Button>
      <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Ta bort</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Liten</Button>
      <Button size="default">Standard</Button>
      <Button size="lg">Stor</Button>
    </div>
  ),
};
