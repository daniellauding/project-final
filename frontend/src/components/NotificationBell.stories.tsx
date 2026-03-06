import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrowserRouter } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { AuthContext } from "../context/AuthContext";

const meta: Meta<typeof NotificationBell> = {
  title: "App/NotificationBell",
  component: NotificationBell,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationBell>;

const mockAuthContext = {
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
};

export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={{ ...mockAuthContext, user: null }}>
        <div className="p-8">
          <p className="text-sm text-muted-foreground mb-4">
            Bell is hidden when logged out
          </p>
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={{
          ...mockAuthContext,
          user: {
            _id: "123",
            username: "johndoe",
            email: "john@example.com",
            accessToken: "fake-token",
          },
        }}
      >
        <div className="p-8">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
};

export const WithUnreadCount: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={{
          ...mockAuthContext,
          user: {
            _id: "123",
            username: "johndoe",
            email: "john@example.com",
            accessToken: "fake-token",
          },
        }}
      >
        <div className="p-8">
          <p className="text-sm text-muted-foreground mb-4">
            Mock: Shows unread badge (requires API)
          </p>
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={{
          ...mockAuthContext,
          user: {
            _id: "123",
            username: "johndoe",
            email: "john@example.com",
            accessToken: "fake-token",
          },
        }}
      >
        <div data-theme="dark" className="p-8">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
  parameters: {
    backgrounds: { default: "dark" },
  },
};
