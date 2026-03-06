import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider } from "./ThemeProvider";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

const meta: Meta<typeof ThemeProvider> = {
  title: "App/ThemeProvider",
  component: ThemeProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

const ThemeDemo = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="w-[400px] p-6 space-y-4">
      <h3 className="text-lg font-semibold">Theme Demo</h3>
      <p className="text-sm text-muted-foreground">
        Current theme: <span className="font-medium">{theme}</span>
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setTheme("light")} size="sm">
          Light
        </Button>
        <Button onClick={() => setTheme("dark")} size="sm">
          Dark
        </Button>
        <Button onClick={() => setTheme("system")} size="sm">
          System
        </Button>
      </div>
      <div className="space-y-2 p-4 bg-muted rounded-md">
        <p className="text-sm">This card adapts to the theme!</p>
        <p className="text-xs text-muted-foreground">
          Try switching between light and dark mode.
        </p>
      </div>
    </Card>
  );
};

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeDemo />
    </ThemeProvider>
  ),
};

export const LightMode: Story = {
  render: () => (
    <ThemeProvider>
      <div data-theme="light">
        <ThemeDemo />
      </div>
    </ThemeProvider>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkMode: Story = {
  render: () => (
    <ThemeProvider>
      <div data-theme="dark">
        <ThemeDemo />
      </div>
    </ThemeProvider>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};
