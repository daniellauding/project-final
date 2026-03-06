import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  multi?: boolean
}

export interface SearchWithFiltersProps {
  placeholder?: string
  filters?: FilterGroup[]
  onSearch?: (query: string, filters: Record<string, string[]>) => void
  searchQuery?: string
  selectedFilters?: Record<string, string[]>
  showResultCount?: boolean
  resultCount?: number
  className?: string
}

export function SearchWithFilters({
  placeholder = "Search...",
  filters = [],
  onSearch,
  searchQuery: controlledQuery,
  selectedFilters: controlledFilters,
  showResultCount = false,
  resultCount,
  className
}: SearchWithFiltersProps) {
  const [query, setQuery] = React.useState(controlledQuery || "")
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>(
    controlledFilters || {}
  )
  
  const isControlled = controlledQuery !== undefined
  const currentQuery = isControlled ? controlledQuery : query
  const currentFilters = controlledFilters || selectedFilters
  
  const handleSearch = (newQuery: string, newFilters: Record<string, string[]>) => {
    if (!isControlled) {
      setQuery(newQuery)
      setSelectedFilters(newFilters)
    }
    onSearch?.(newQuery, newFilters)
  }
  
  const handleQueryChange = (newQuery: string) => {
    handleSearch(newQuery, currentFilters)
  }
  
  const handleFilterToggle = (groupId: string, value: string, multi: boolean = false) => {
    const currentValues = currentFilters[groupId] || []
    let newValues: string[]
    
    if (multi) {
      newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
    } else {
      newValues = currentValues.includes(value) ? [] : [value]
    }
    
    const newFilters = {
      ...currentFilters,
      [groupId]: newValues
    }
    
    handleSearch(currentQuery, newFilters)
  }
  
  const handleClearFilters = () => {
    handleSearch(currentQuery, {})
  }
  
  const activeFilterCount = Object.values(currentFilters).flat().length
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar with Filters */}
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={currentQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-9 pr-10"
          />
          {currentQuery && (
            <button
              onClick={() => handleQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Filter Dropdowns */}
        {filters.map((filterGroup) => {
          const selectedCount = (currentFilters[filterGroup.id] || []).length
          
          return (
            <DropdownMenu key={filterGroup.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {filterGroup.label}
                  {selectedCount > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                      {selectedCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{filterGroup.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterGroup.options.map((option) => {
                  const isSelected = (currentFilters[filterGroup.id] || []).includes(
                    option.value
                  )
                  
                  return (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={isSelected}
                      onCheckedChange={() =>
                        handleFilterToggle(
                          filterGroup.id,
                          option.value,
                          filterGroup.multi
                        )
                      }
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
      </div>
      
      {/* Active Filters & Result Count */}
      {(activeFilterCount > 0 || showResultCount) && (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(currentFilters).map(([groupId, values]) => {
              const group = filters.find((f) => f.id === groupId)
              if (!group || values.length === 0) return null
              
              return values.map((value) => {
                const option = group.options.find((o) => o.value === value)
                if (!option) return null
                
                return (
                  <Badge key={`${groupId}-${value}`} variant="secondary" className="gap-1">
                    {option.label}
                    <button
                      onClick={() => handleFilterToggle(groupId, value, group.multi)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })
            })}
            
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          
          {showResultCount && resultCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
