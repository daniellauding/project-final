import type { Meta, StoryObj } from "@storybook/react-vite";
import TextFilePreview from "./TextFilePreview";
import { Card } from "./ui/card";

const meta: Meta<typeof TextFilePreview> = {
  title: "App/TextFilePreview",
  component: TextFilePreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextFilePreview>;

export const Markdown: Story = {
  render: () => (
    <Card className="w-[600px] max-h-[400px] overflow-hidden">
      <TextFilePreview
        url="data:text/plain;base64,IyBIZWxsbyBXb3JsZAoKVGhpcyBpcyBhICoqbWFya2Rvd24qKiBwcmV2aWV3Lg=="
        fileName="example.md"
        className="h-full"
      />
    </Card>
  ),
};

export const PlainText: Story = {
  render: () => (
    <Card className="w-[600px] max-h-[400px] overflow-hidden">
      <TextFilePreview
        url="data:text/plain;base64,VGhpcyBpcyBhIHBsYWluIHRleHQgZmlsZS4="
        fileName="example.txt"
        className="h-full"
      />
    </Card>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <Card className="w-[600px] max-h-[400px] overflow-hidden">
      <TextFilePreview
        url="data:text/plain;base64,IyBIZWxsbyBXb3JsZAoKVGhpcyBpcyBhICoqbWFya2Rvd24qKiBwcmV2aWV3Lg=="
        fileName="example.md"
        className="h-full"
      />
    </Card>
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
