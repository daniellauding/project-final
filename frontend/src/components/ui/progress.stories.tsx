import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";
import { useEffect, useState } from "react";

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

export const Quarter: Story = {
  args: {
    value: 25,
    className: "w-[300px]",
  },
};

export const Half: Story = {
  args: {
    value: 50,
    className: "w-[300px]",
  },
};

export const ThreeQuarters: Story = {
  args: {
    value: 75,
    className: "w-[300px]",
  },
};

export const Full: Story = {
  args: {
    value: 100,
    className: "w-[300px]",
  },
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return <Progress value={progress} className="w-[300px]" />;
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

export const MultipleProgress: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>JavaScript</span>
          <span>70%</span>
        </div>
        <Progress value={70} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>TypeScript</span>
          <span>85%</span>
        </div>
        <Progress value={85} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>React</span>
          <span>90%</span>
        </div>
        <Progress value={90} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>CSS</span>
          <span>60%</span>
        </div>
        <Progress value={60} />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <Progress value={66} className="h-1" />
      <Progress value={66} className="h-2" />
      <Progress value={66} className="h-3" />
      <Progress value={66} className="h-4" />
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Upload Progress</span>
          <span>75%</span>
        </div>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Processing</span>
          <span>40%</span>
        </div>
        <Progress value={40} />
      </div>
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
