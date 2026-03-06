import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster } from "./sonner";
import { Button } from "./button";
import { toast } from "sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI/Feedback/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast("Event has been created")}>
        Show Toast
      </Button>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast.success("Successfully saved!")}>
        Show Success
      </Button>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="destructive"
        onClick={() => toast.error("Something went wrong")}
      >
        Show Error
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast("Event has been created", {
            action: {
              label: "Undo",
              onClick: () => toast("Undo clicked"),
            },
          })
        }
      >
        Show with Action
      </Button>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster />
      <Button onClick={() => toast("Default toast")}>Default</Button>
      <Button onClick={() => toast.success("Success!")}>Success</Button>
      <Button onClick={() => toast.error("Error occurred")}>Error</Button>
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
