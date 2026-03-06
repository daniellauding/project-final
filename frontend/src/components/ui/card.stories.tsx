import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const PollCard: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Which logo is best?</CardTitle>
          <Badge>published</Badge>
        </div>
        <CardDescription>We need to pick a new logo</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">3 options | 10 votes</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm">View</Button>
        <Button size="sm" variant="outline">Share</Button>
      </CardFooter>
    </Card>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Card className="max-w-sm text-center p-8">
      <CardContent>
        <p className="text-muted-foreground">No polls yet</p>
        <Button className="mt-4">Create your first</Button>
      </CardContent>
    </Card>
  ),
};
