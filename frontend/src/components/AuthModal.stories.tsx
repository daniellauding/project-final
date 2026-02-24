import type { Meta, StoryObj } from "@storybook/react-vite";
import AuthModal from "./AuthModal";
import { AuthProvider } from "../context/AuthContext";

const meta: Meta<typeof AuthModal> = {
  title: "Components/AuthModal",
  component: AuthModal,
  decorators: [(Story) => <AuthProvider><Story /></AuthProvider>],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthModal>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
};
