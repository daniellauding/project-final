import type { Meta, StoryObj } from "@storybook/react"
import {
  Hero1,
  Hero2,
  FeatureGrid,
  PricingTable,
  Testimonial,
  CTASection,
  SettingsPanel,
  EmptyState,
  DataTable,
  StatDashboard,
  ActivityFeed,
  UserProfile,
  MultiStepForm,
  FileUploadZone,
  SearchWithFilters,
} from "./index"
import { Check, Zap, Shield, Users, FileQuestion, Plus, TrendingUp, Activity, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const meta = {
  title: "Blocks",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta

export default meta

// ============================================
// Marketing Blocks
// ============================================

export const Hero1Story: StoryObj = {
  name: "Marketing / Hero 1 (Centered)",
  render: () => (
    <Hero1
      badge="New Feature"
      title="Get better feedback on your designs"
      subtitle="Pejla helps you collect structured design feedback from your team and stakeholders. Make better decisions, faster."
      ctaPrimary={{ text: "Start Free Trial", onClick: () => console.log("Primary CTA") }}
      ctaSecondary={{ text: "Watch Demo", onClick: () => console.log("Secondary CTA") }}
      media={{
        src: "https://placehold.co/1200x600/5b21b6/white?text=Dashboard+Preview",
        alt: "Dashboard Preview"
      }}
    />
  ),
}

export const Hero2Story: StoryObj = {
  name: "Marketing / Hero 2 (Split)",
  render: () => (
    <Hero2
      headline="Build better products with real feedback"
      subtitle="Stop guessing what your users want. Get actionable feedback on every design decision."
      features={[
        {
          icon: Zap,
          name: "Lightning fast",
          description: "Create polls in seconds, get results instantly."
        },
        {
          icon: Shield,
          name: "Secure & private",
          description: "Your data is encrypted and protected."
        },
        {
          icon: Users,
          name: "Team collaboration",
          description: "Work together with your entire team."
        }
      ]}
      cta={{ text: "Get Started", onClick: () => console.log("CTA") }}
      media={{
        src: "https://placehold.co/800x600/5b21b6/white?text=Product+Screenshot",
        alt: "Product Screenshot"
      }}
    />
  ),
}

export const FeatureGridStory: StoryObj = {
  name: "Marketing / Feature Grid",
  render: () => (
    <FeatureGrid
      title="Everything you need to get feedback"
      description="Powerful features to help you make better design decisions"
      features={[
        {
          icon: <Check className="h-6 w-6" />,
          title: "Quick Polls",
          description: "Create polls in seconds with images, videos, or embeds. Get feedback fast.",
          link: { label: "Learn more", href: "#" }
        },
        {
          icon: <Zap className="h-6 w-6" />,
          title: "Real-time Results",
          description: "See votes and comments as they come in. Make decisions instantly.",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "Private & Secure",
          description: "Your designs are protected. Share only with who you want.",
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Team Collaboration",
          description: "Invite your team, clients, or stakeholders to vote and comment.",
        },
        {
          icon: <Activity className="h-6 w-6" />,
          title: "Analytics",
          description: "Track engagement, voting patterns, and decision-making trends.",
        },
        {
          icon: <Mail className="h-6 w-6" />,
          title: "Email Notifications",
          description: "Get notified when people vote or comment on your polls.",
        },
      ]}
      variant="plain"
    />
  ),
}

export const PricingTableStory: StoryObj = {
  name: "Marketing / Pricing Table",
  render: () => (
    <PricingTable
      title="Simple, transparent pricing"
      description="Choose the plan that works for you"
      tiers={[
        {
          id: "free",
          name: "Free",
          description: "For individuals trying out Pejla",
          price: { monthly: "$0", annual: "$0" },
          features: [
            "5 polls per month",
            "Up to 20 votes per poll",
            "Basic analytics",
            "Email support"
          ],
          cta: "Get Started",
          href: "/signup"
        },
        {
          id: "pro",
          name: "Pro",
          description: "For teams that need more",
          price: { monthly: "$29", annual: "$290" },
          features: [
            "Unlimited polls",
            "Unlimited votes",
            "Advanced analytics",
            "Priority support",
            "Custom branding",
            "Export data"
          ],
          cta: "Start Free Trial",
          href: "/signup?plan=pro",
          popular: true
        },
        {
          id: "enterprise",
          name: "Enterprise",
          description: "For large organizations",
          price: { monthly: "Custom", annual: "Custom" },
          features: [
            "Everything in Pro",
            "SSO & SAML",
            "Dedicated support",
            "SLA guarantee",
            "Custom integrations",
            "Onboarding & training"
          ],
          cta: "Contact Sales",
          href: "/contact"
        }
      ]}
    />
  ),
}

export const TestimonialStory: StoryObj = {
  name: "Marketing / Testimonial Carousel",
  render: () => (
    <Testimonial
      testimonials={[
        {
          quote: "Pejla transformed our design review process. We now get feedback in minutes instead of days. Highly recommended!",
          author: {
            name: "Sarah Johnson",
            role: "Head of Design",
            company: "Acme Corp",
            avatar: "https://i.pravatar.cc/150?img=1"
          }
        },
        {
          quote: "The best tool for getting quick design feedback. Our team uses it every day and loves it.",
          author: {
            name: "Michael Chen",
            role: "Product Manager",
            company: "Tech Startup Inc",
            avatar: "https://i.pravatar.cc/150?img=2"
          }
        },
        {
          quote: "Simple, fast, and effective. Pejla helps us make better design decisions with real data.",
          author: {
            name: "Emma Davis",
            role: "UX Lead",
            company: "Design Studio",
            avatar: "https://i.pravatar.cc/150?img=3"
          }
        }
      ]}
      autoplay={false}
    />
  ),
}

export const CTASectionStory: StoryObj = {
  name: "Marketing / CTA Section",
  render: () => (
    <CTASection
      title="Ready to get better feedback?"
      subtitle="Start your free trial today. No credit card required."
      cta={{ text: "Start Free Trial", onClick: () => console.log("CTA clicked") }}
    />
  ),
}

export const CTASectionEmailStory: StoryObj = {
  name: "Marketing / CTA Section (Email Capture)",
  render: () => (
    <CTASection
      title="Stay updated with Pejla"
      subtitle="Get the latest features, tips, and design inspiration delivered to your inbox."
      emailCapture={{
        placeholder: "Enter your email",
        buttonText: "Subscribe",
        onSubmit: (email) => console.log("Email submitted:", email)
      }}
    />
  ),
}

// ============================================
// App Blocks
// ============================================

export const SettingsPanelStory: StoryObj = {
  name: "App / Settings Panel",
  render: () => (
    <SettingsPanel
      sections={[
        {
          id: "general",
          label: "General",
          icon: "⚙️",
          content: (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <Button>Save Changes</Button>
            </div>
          )
        },
        {
          id: "security",
          label: "Security",
          icon: "🔒",
          content: (
            <div className="space-y-6">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
              <Button>Update Password</Button>
            </div>
          )
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: "🔔",
          content: (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              <Button variant="outline">Configure Notifications</Button>
            </div>
          )
        }
      ]}
    />
  ),
}

export const EmptyStateStory: StoryObj = {
  name: "App / Empty State",
  render: () => (
    <EmptyState
      icon={FileQuestion}
      title="No polls created yet"
      description="Create your first poll to get started collecting feedback from your team."
      action={{
        text: "Create First Poll",
        icon: <Plus className="h-4 w-4" />,
        onClick: () => console.log("Create poll")
      }}
    />
  ),
}

export const DataTableStory: StoryObj = {
  name: "App / Data Table",
  render: () => (
    <DataTable
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "status", label: "Status", sortable: true, render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs ${
            value === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            {value}
          </span>
        )},
        { key: "votes", label: "Votes", sortable: true },
        { key: "created", label: "Created", sortable: true },
      ]}
      data={[
        { name: "Design Poll A", status: "Active", votes: 123, created: "2024-03-01" },
        { name: "Logo Feedback", status: "Draft", votes: 0, created: "2024-03-05" },
        { name: "Website Redesign", status: "Active", votes: 456, created: "2024-02-28" },
        { name: "App Icon Vote", status: "Closed", votes: 234, created: "2024-02-25" },
      ]}
      searchable
      searchPlaceholder="Search polls..."
      actions={(row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      pagination={{
        page: 1,
        pageSize: 10,
        total: 4,
        onPageChange: (page) => console.log("Page:", page)
      }}
    />
  ),
}

export const StatDashboardStory: StoryObj = {
  name: "App / Stat Dashboard",
  render: () => (
    <StatDashboard
      stats={[
        {
          label: "Total Polls",
          value: "142",
          trend: { value: "+12%", isPositive: true },
          icon: <Activity className="h-5 w-5" />
        },
        {
          label: "Active Users",
          value: "1,234",
          trend: { value: "+3%", isPositive: true },
          icon: <Users className="h-5 w-5" />
        },
        {
          label: "Avg. Rating",
          value: "4.8",
          trend: { value: "+0.2", isPositive: true },
          icon: <TrendingUp className="h-5 w-5" />
        },
        {
          label: "Response Rate",
          value: "87%",
          trend: { value: "-2%", isPositive: false },
          icon: <Zap className="h-5 w-5" />
        }
      ]}
    />
  ),
}

export const ActivityFeedStory: StoryObj = {
  name: "App / Activity Feed",
  render: () => (
    <ActivityFeed
      activities={[
        {
          id: "1",
          type: "comment",
          user: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
          action: "commented on",
          target: "Design Poll",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: "2",
          type: "vote",
          user: { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=2" },
          action: "voted on",
          target: "Logo Feedback",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          id: "3",
          type: "create",
          user: { name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=3" },
          action: "created a new poll",
          target: "Website Redesign",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]}
    />
  ),
}

export const UserProfileStory: StoryObj = {
  name: "App / User Profile",
  render: () => (
    <UserProfile
      user={{
        name: "Sarah Johnson",
        username: "sarahj",
        bio: "Head of Design at Acme Corp. Passionate about creating beautiful, user-friendly products.",
        location: "San Francisco, CA",
        website: "https://sarahjohnson.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        coverImage: "https://placehold.co/1200x400/5b21b6/white?text=Cover+Image"
      }}
      stats={[
        { label: "Polls", value: "142" },
        { label: "Followers", value: "1.2K" },
        { label: "Following", value: "456" }
      ]}
      actions={[
        { label: "Edit Profile", variant: "default", onClick: () => console.log("Edit") },
        { label: "Share", variant: "outline", onClick: () => console.log("Share") }
      ]}
    />
  ),
}

// ============================================
// Form Blocks
// ============================================

export const MultiStepFormStory: StoryObj = {
  name: "Forms / Multi-Step Form",
  render: () => (
    <MultiStepForm
      steps={[
        {
          id: "basic",
          title: "Basic Information",
          description: "Tell us about yourself",
          content: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            </div>
          )
        },
        {
          id: "company",
          title: "Company Details",
          description: "Information about your organization",
          content: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Acme Corp" />
              </div>
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Input id="role" placeholder="Designer" />
              </div>
            </div>
          )
        },
        {
          id: "preferences",
          title: "Preferences",
          description: "Customize your experience",
          content: (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure your notification and privacy settings
              </p>
            </div>
          )
        }
      ]}
      onComplete={(data) => console.log("Form completed:", data)}
    />
  ),
}

export const FileUploadZoneStory: StoryObj = {
  name: "Forms / File Upload Zone",
  render: () => {
    const [files, setFiles] = React.useState<any[]>([])
    
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <FileUploadZone
          onFilesAdded={(newFiles) => {
            const uploadedFiles = newFiles.map((file) => ({
              id: Math.random().toString(),
              file,
              name: file.name,
              size: file.size,
              type: file.type,
              progress: 100
            }))
            setFiles([...files, ...uploadedFiles])
          }}
          onFileRemove={(id) => {
            setFiles(files.filter((f) => f.id !== id))
          }}
          uploadedFiles={files}
          accept="image/*,.pdf"
          maxSize={10}
        />
      </div>
    )
  },
}

export const SearchWithFiltersStory: StoryObj = {
  name: "Forms / Search with Filters",
  render: () => (
    <div className="p-8 max-w-4xl mx-auto">
      <SearchWithFilters
        placeholder="Search polls..."
        filters={[
          {
            id: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Closed", value: "closed" }
            ]
          },
          {
            id: "type",
            label: "Type",
            options: [
              { label: "Design", value: "design" },
              { label: "Product", value: "product" },
              { label: "Marketing", value: "marketing" }
            ],
            multi: true
          },
          {
            id: "date",
            label: "Date",
            options: [
              { label: "Today", value: "today" },
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" }
            ]
          }
        ]}
        onSearch={(query, filters) => console.log("Search:", query, filters)}
        showResultCount
        resultCount={42}
      />
    </div>
  ),
}
