import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, FileImage, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress?: number
  url?: string
}

export interface FileUploadZoneProps {
  onFilesAdded?: (files: File[]) => void
  onFileRemove?: (fileId: string) => void
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  multiple?: boolean
  uploadedFiles?: UploadedFile[]
  className?: string
}

export function FileUploadZone({
  onFilesAdded,
  onFileRemove,
  accept,
  maxSize = 10,
  maxFiles = 10,
  multiple = true,
  uploadedFiles = [],
  className
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    handleFiles(files)
  }
  
  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds ${maxSize}MB`)
        return false
      }
      return true
    })
    
    const filesToAdd = multiple
      ? validFiles.slice(0, maxFiles - uploadedFiles.length)
      : validFiles.slice(0, 1)
    
    if (filesToAdd.length > 0) {
      onFilesAdded?.(filesToAdd)
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }
  
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return FileImage
    if (type.includes("pdf") || type.includes("document")) return FileText
    return File
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        
        <p className="text-base font-medium text-foreground mb-1">
          {isDragging ? "Drop files here" : "Drag and drop files here"}
        </p>
        
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse
        </p>
        
        <p className="text-xs text-muted-foreground">
          {accept && `Supports: ${accept.split(",").join(", ")} · `}
          Max {maxSize}MB per file
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      
      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile) => {
            const FileIcon = getFileIcon(uploadedFile.type)
            
            return (
              <Card key={uploadedFile.id} className="p-4">
                <div className="flex items-center gap-4">
                  <FileIcon className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                    
                    {uploadedFile.progress !== undefined && uploadedFile.progress < 100 && (
                      <Progress value={uploadedFile.progress} className="mt-2 h-1" />
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onFileRemove?.(uploadedFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
