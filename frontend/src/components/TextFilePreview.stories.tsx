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

// Mock content for demonstration
const mockMarkdown = `# Hello World

This is a **markdown** preview.

## Features
- Lists
- _Italic text_
- **Bold text**

\`\`\`js
const code = "highlighted";
\`\`\`
`;

const mockText = `This is a plain text file.

It supports multiple lines
and preserves whitespace.

Simple and clean.`;

const mockCSV = `Name,Email,Role
John Doe,john@example.com,Developer
Jane Smith,jane@example.com,Designer
Bob Johnson,bob@example.com,Manager`;

export const Markdown: Story = {
  render: () => (
    <Card className="w-[600px] max-h-[400px] overflow-hidden">
      <TextFilePreview
        url="data:text/plain;base64,IyBIZWxsbyBXb3JsZAoKVGhpcyBpcyBhICoqbWFya2Rvd24qKiBwcmV2aWV3LgoKIyMgRmVhdHVyZXMKLSBMaXN0cwotIF9JdGFsaWMgdGV4dF8KLSAqKkJvbGQgdGV4dCoqCgpgYGBqcwpjb25zdCBjb2RlID0gImhpZ2hsaWdodGVkIjsKYGBg"
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
        url="data:text/plain;base64,VGhpcyBpcyBhIHBsYWluIHRleHQgZmlsZS4KCkl0IHN1cHBvcnRzIG11bHRpcGxlIGxpbmVzCmFuZCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZS4KClNpbXBsZSBhbmQgY2xlYW4u"
        fileName="example.txt"
        className="h-full"
      />
    </Card>
  ),
};

export const CSV: Story = {
  render: () => (
    <Card className="w-[600px] max-h-[400px] overflow-hidden">
      <TextFilePreview
        url="data:text/plain;base64,TmFtZSxFbWFpbCxSb2xlCkpvaG4gRG9lLGpvaG5AZXhhbXBsZS5jb20sRGV2ZWxvcGVyCkphbmUgU21pdGgsamFuZUBleGFtcGxlLmNvbSxEZXNpZ25lcgpCb2IgSm9obnNvbixib2JAZXhhbXBsZS5jb20sTWFuYWdlcg=="
        fileName="data.csv"
        className="h-full"
      />
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card className="w-[600px] h-[200px]">
      <TextFilePreview
        url="https://slow-loading-url.com/file.txt"
        className="h-full"
      />
    </Card>
  ),
};

export const Error: Story = {
  render: () => (
    <Card className="w-[600px] h-[200px]">
      <TextFilePreview
        url="https://invalid-url-that-will-fail.com/file.txt"
        fileName="error.txt"
        className="h-full"
      />
    </Card>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <Card className="w-[600px] max-h-[400px] overflow-hidden">
      <TextFilePreview
        url="data:text/plain;base64,IyBIZWxsbyBXb3JsZAoKVGhpcyBpcyBhICoqbWFya2Rvd24qKiBwcmV2aWV3LgoKIyMgRmVhdHVyZXMKLSBMaXN0cwotIF9JdGFsaWMgdGV4dF8KLSAqKkJvbGQgdGV4dCoqCgpgYGBqcwpjb25zdCBjb2RlID0gImhpZ2hsaWdodGVkIjsKYGBg"
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
