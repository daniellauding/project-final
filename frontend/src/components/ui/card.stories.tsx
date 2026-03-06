import type { Meta, StoryObj } from "@storybook/react"
import { MoreVertical, MessageCircle, ThumbsUp, Share2 } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardActions, CardMedia, CardAction } from "./card"
import { Button, ButtonIcon } from "./button"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    elevation: {
      control: "select",
      options: ["flat", "raised", "floating"],
    },
    interactive: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area. You can put any content here.</p>
      </CardContent>
    </Card>
  ),
}

export const Elevations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Card elevation="flat" className="w-[300px]">
        <CardHeader>
          <CardTitle>Flat Card</CardTitle>
          <CardDescription>No elevation, blends with surface</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Flat elevation for subtle cards.</p>
        </CardContent>
      </Card>
      
      <Card elevation="raised" className="w-[300px]">
        <CardHeader>
          <CardTitle>Raised Card</CardTitle>
          <CardDescription>Medium elevation (default)</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Raised elevation for standard cards.</p>
        </CardContent>
      </Card>
      
      <Card elevation="floating" className="w-[300px]">
        <CardHeader>
          <CardTitle>Floating Card</CardTitle>
          <CardDescription>High elevation for emphasis</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Floating elevation for important cards.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Card 
        elevation="raised" 
        interactive 
        onPress={() => alert("Card clicked!")}
        className="w-[350px]"
      >
        <CardHeader>
          <CardTitle>Click me!</CardTitle>
          <CardDescription>This card is interactive</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover and click to see the interaction states.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <Card elevation="raised" className="w-[400px]">
      <CardMedia>
        <img 
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=400&fit=crop" 
          alt="Placeholder" 
          className="w-full h-48 object-cover"
        />
      </CardMedia>
      <CardHeader>
        <CardTitle>Beautiful Landscape</CardTitle>
        <CardDescription>Card with media at the top</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Cards can have media sections for images or videos.</p>
      </CardContent>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card elevation="raised" className="w-[400px]">
      <CardHeader>
        <CardTitle>Project Dashboard</CardTitle>
        <CardDescription>32 tasks · 5 members</CardDescription>
        <CardAction>
          <Button size="icon-sm" variant="ghost">
            <MoreVertical className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>View your project progress and team activity.</p>
      </CardContent>
      <CardActions>
        <Button size="sm" variant="outline">Details</Button>
        <Button size="sm">Open Project</Button>
      </CardActions>
    </Card>
  ),
}

export const PollCard: Story = {
  render: () => (
    <Card 
      elevation="raised" 
      interactive 
      onPress={() => alert("Open poll")}
      className="w-[450px]"
    >
      <CardMedia>
        <img 
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=300&fit=crop" 
          alt="Poll" 
          className="w-full h-40 object-cover"
        />
      </CardMedia>
      <CardHeader>
        <CardTitle>Design A vs Design B</CardTitle>
        <CardDescription>1,234 votes · 45 comments · 2 days ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Which design do you prefer for our new landing page?</p>
      </CardContent>
      <CardActions>
        <Button size="sm" variant="ghost">
          <ButtonIcon slot="leading">
            <ThumbsUp className="size-4" />
          </ButtonIcon>
          Vote
        </Button>
        <Button size="sm" variant="ghost">
          <ButtonIcon slot="leading">
            <MessageCircle className="size-4" />
          </ButtonIcon>
          Comment
        </Button>
        <Button size="sm" variant="ghost">
          <ButtonIcon slot="leading">
            <Share2 className="size-4" />
          </ButtonIcon>
          Share
        </Button>
      </CardActions>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card elevation="raised" className="w-[400px]">
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
        <CardDescription>Are you sure you want to continue?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This action cannot be undone. Please review before proceeding.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
}
