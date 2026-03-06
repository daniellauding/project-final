import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface SettingsSection {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

export interface SettingsPanelProps {
  sections: SettingsSection[]
  defaultSection?: string
  className?: string
}

export function SettingsPanel({
  sections,
  defaultSection,
  className
}: SettingsPanelProps) {
  const [activeSection, setActiveSection] = React.useState(
    defaultSection || sections[0]?.id
  )
  
  const currentSection = sections.find((s) => s.id === activeSection)
  
  return (
    <div className={cn("flex min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background">
        <nav className="flex flex-col gap-1 p-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {section.icon && <span className="text-lg">{section.icon}</span>}
              {section.label}
            </button>
          ))}
        </nav>
      </aside>
      
      {/* Content */}
      <main className="flex-1 p-8">
        <Card className="mx-auto max-w-4xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {currentSection?.label}
            </h2>
            <div>{currentSection?.content}</div>
          </div>
        </Card>
      </main>
    </div>
  )
}
