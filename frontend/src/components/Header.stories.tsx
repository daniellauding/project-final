import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";

const meta: Meta<typeof Header> = {
  title: "App/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
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
type Story = StoryObj<typeof Header>;

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
        <Story />
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
        <Story />
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
        <div data-theme="dark">
          <Story />
        </div>
      </AuthContext.Provider>
    ),
  ],
  parameters: {
    backgrounds: { default: "dark" },
  },
};
