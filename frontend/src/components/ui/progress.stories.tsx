import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Feedback/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 50,
    className: "w-[300px]",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: "w-[300px]",
  },
};

export const Full: Story = {
  args: {
    value: 100,
    className: "w-[300px]",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <div className="flex justify-between text-sm">
        <span>Uploading...</span>
        <span>66%</span>
      </div>
      <Progress value={66} />
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <div className="flex justify-between text-sm">
        <span>Upload Progress</span>
        <span>75%</span>
      </div>
      <Progress value={75} />
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
