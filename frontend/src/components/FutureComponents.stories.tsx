import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  ChevronDown,
  Users,
  Mail,
  Search,
  MoreVertical,
  Crown,
  Shield,
  User,
  TrendingUp,
  BarChart3,
  FileText,
  Upload,
  Image as ImageIcon,
  Inbox,
  Calendar,
} from "lucide-react";

const meta: Meta = {
  title: "Future/Wireframes",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// ============================================
// PHASE 2: ORGANIZATIONS & TEAMS
// ============================================

export const OrganizationSwitcher: Story = {
  render: () => (
    <Card className="w-64 p-2">
      <button className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="text-sm font-medium">Acme Inc</div>
            <div className="text-xs text-muted-foreground">3 teams · 12 members</div>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Dropdown with search\n- List of user organizations\n- Create new organization option\n- Switch between orgs instantly",
      },
    },
  },
};

export const MemberList: Story = {
  render: () => (
    <Card className="w-[600px] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <Button size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </div>
      <div className="space-y-2">
        {[
          { name: "John Doe", email: "john@example.com", role: "Owner", badge: Crown },
          { name: "Jane Smith", email: "jane@example.com", role: "Admin", badge: Shield },
          { name: "Bob Johnson", email: "bob@example.com", role: "Member", badge: User },
        ].map((member, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 hover:bg-accent rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <member.badge className="h-3 w-3" />
                {member.role}
              </Badge>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Full member management\n- Role editing\n- Member removal\n- Bulk actions\n- Search and filter",
      },
    },
  },
};

export const InviteForm: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email Address</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="colleague@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-role">Role</Label>
          <button className="w-full flex items-center justify-between p-2 border rounded-md hover:bg-accent transition-colors">
            <span className="text-sm">Member</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted-foreground">
            Members can create polls and vote
          </p>
        </div>
        <Button className="w-full">Send Invitation</Button>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Email validation\n- Role selector with permissions preview\n- Bulk invite (multiple emails)\n- Custom invitation message",
      },
    },
  },
};

export const BillingPlan: Story = {
  render: () => (
    <Card className="w-80 p-6 border-2 border-primary">
      <Badge className="mb-4">Most Popular</Badge>
      <h3 className="text-2xl font-bold mb-2">Pro</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">$29</span>
        <span className="text-muted-foreground">/month</span>
      </div>
      <ul className="space-y-2 mb-6">
        <li className="text-sm flex items-center gap-2">
          ✓ Unlimited polls
        </li>
        <li className="text-sm flex items-center gap-2">
          ✓ Up to 50 team members
        </li>
        <li className="text-sm flex items-center gap-2">
          ✓ Advanced analytics
        </li>
        <li className="text-sm flex items-center gap-2">
          ✓ Custom branding
        </li>
        <li className="text-sm flex items-center gap-2">
          ✓ Priority support
        </li>
      </ul>
      <Button className="w-full">Upgrade to Pro</Button>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Interactive pricing calculator\n- Annual/monthly toggle\n- Feature comparison tooltip\n- Current plan indicator",
      },
    },
  },
};

// ============================================
// PHASE 3: ADVANCED FORMS
// ============================================

export const MultiStepForm: Story = {
  render: () => (
    <Card className="w-[500px] p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 ${
                    step < 2 ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Step 2 of 4: Add Options</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Option 1</Label>
          <Input placeholder="Enter option..." />
        </div>
        <div className="space-y-2">
          <Label>Option 2</Label>
          <Input placeholder="Enter option..." />
        </div>
        <Button variant="outline" className="w-full">
          + Add Option
        </Button>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline">Back</Button>
        <Button>Next</Button>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Step validation\n- Progress persistence\n- Skip optional steps\n- Summary before submit",
      },
    },
  },
};

export const FileUploadZone: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mb-4">
          PNG, JPG or PDF up to 5MB
        </p>
        <Button size="sm">Select Files</Button>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3 p-2 bg-muted rounded-md">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">design-mockup.png</p>
            <Progress value={100} className="h-1 mt-1" />
          </div>
          <Badge variant="secondary">2.3 MB</Badge>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Drag-and-drop support\n- Multiple file upload\n- Image preview thumbnails\n- Upload progress tracking\n- File validation",
      },
    },
  },
};

export const RichTextEditor: Story = {
  render: () => (
    <Card className="w-[600px] p-4">
      <div className="border rounded-md">
        <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <strong>B</strong>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <em>I</em>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <u>U</u>
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-8 px-2">
            Link
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            Image
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            Code
          </Button>
        </div>
        <div className="p-4 min-h-[200px] text-sm">
          <p className="text-muted-foreground">Start typing...</p>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Markdown support\n- Image upload\n- Link insertion\n- Code blocks with syntax highlighting\n- Preview mode",
      },
    },
  },
};

// ============================================
// PHASE 4: DATA VISUALIZATION
// ============================================

export const StatCard: Story = {
  render: () => (
    <Card className="w-64 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Total Votes</p>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">1,247</span>
        <Badge variant="secondary" className="text-green-600">
          +12%
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        vs. last month
      </p>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Real-time updates\n- Sparkline chart\n- Custom time ranges\n- Drill-down details",
      },
    },
  },
};

export const PollResultsChart: Story = {
  render: () => (
    <Card className="w-96 p-6">
      <h3 className="text-lg font-semibold mb-4">Poll Results</h3>
      <div className="space-y-3">
        {[
          { option: "Design A", votes: 124, percentage: 62 },
          { option: "Design B", votes: 76, percentage: 38 },
        ].map((result, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium">{result.option}</span>
              <span className="text-muted-foreground">
                {result.votes} votes ({result.percentage}%)
              </span>
            </div>
            <Progress value={result.percentage} />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          200 total votes · Poll closes in 2 days
        </p>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Animated progress bars\n- Winner badge\n- Export results\n- Filter by date range",
      },
    },
  },
};

export const ActivityFeed: Story = {
  render: () => (
    <Card className="w-96 p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[
          {
            user: "John Doe",
            action: "voted on",
            target: "Which design?",
            time: "2m ago",
          },
          {
            user: "Jane Smith",
            action: "commented on",
            target: "Homepage redesign",
            time: "15m ago",
          },
          {
            user: "Bob Johnson",
            action: "created poll",
            target: "Team lunch options",
            time: "1h ago",
          },
        ].map((activity, i) => (
          <div key={i} className="flex gap-3">
            <Avatar size="sm">
              <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Real-time updates\n- Infinite scroll\n- Activity filters\n- Group by date",
      },
    },
  },
};

export const Leaderboard: Story = {
  render: () => (
    <Card className="w-80 p-4">
      <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
      <div className="space-y-2">
        {[
          { rank: 1, name: "Alice Chen", score: 847, badge: "🏆" },
          { rank: 2, name: "Bob Smith", score: 723, badge: "🥈" },
          { rank: 3, name: "Carol Lee", score: 689, badge: "🥉" },
          { rank: 4, name: "David Kim", score: 542, badge: "" },
          { rank: 5, name: "Eve Wilson", score: 501, badge: "" },
        ].map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center gap-3 p-2 hover:bg-accent rounded-md transition-colors"
          >
            <span className="text-lg font-bold w-6">{entry.badge || entry.rank}</span>
            <Avatar size="sm">
              <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm font-medium">{entry.name}</span>
            <Badge variant="secondary">{entry.score}</Badge>
          </div>
        ))}
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Time period selector\n- Score breakdown\n- User profile links\n- Pagination",
      },
    },
  },
};

// ============================================
// PHASE 5: EMPTY STATES & ONBOARDING
// ============================================

export const EmptyState: Story = {
  render: () => (
    <div className="w-96 p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Create your first poll to get started collecting feedback from your team.
      </p>
      <Button>Create Your First Poll</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Contextual illustrations\n- Quick action buttons\n- Help links\n- Onboarding tour trigger",
      },
    },
  },
};

export const WelcomeModal: Story = {
  render: () => (
    <Card className="w-[500px] p-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">👋</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Pejla!</h2>
        <p className="text-muted-foreground">
          Let's get you set up in just a few steps
        </p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-2 w-12 rounded-full ${
              step === 1 ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold mb-1">Create Your First Poll</h3>
          <p className="text-sm text-muted-foreground">
            Start gathering feedback from your team instantly
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline">Skip</Button>
        <Button>Next</Button>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Multi-step onboarding\n- Progress tracking\n- Skip/dismiss options\n- User preferences storage",
      },
    },
  },
};

// ============================================
// SETTINGS & CONFIGURATION
// ============================================

export const SettingsLayout: Story = {
  render: () => (
    <div className="w-[800px] flex gap-6">
      <Card className="w-48 p-2">
        <nav className="space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm font-medium bg-accent rounded-md">
            General
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors">
            Team
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors">
            Billing
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors">
            Notifications
          </button>
        </nav>
      </Card>
      <Card className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input defaultValue="Acme Inc" />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input placeholder="https://example.com" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Mobile responsive sidebar\n- Breadcrumb navigation\n- Unsaved changes warning\n- Keyboard shortcuts",
      },
    },
  },
};

export const DangerZone: Story = {
  render: () => (
    <Card className="w-96 p-6 border-destructive">
      <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Irreversible and destructive actions
      </p>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-md">
          <div>
            <p className="text-sm font-medium">Delete Organization</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete this organization and all data
            </p>
          </div>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "**Status:** Wireframe only\n\n**Future implementation:**\n- Confirmation dialog\n- Re-authentication required\n- Countdown timer\n- Data export option",
      },
    },
  },
};
