import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Note } from '../types/Note'
import { Edit3, Save, X, Heart, Pin, Trash2 } from 'lucide-react'

interface NoteDetailDialogProps {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
}

export function NoteDetailDialog({ note, open, onOpenChange, onUpdate, onDelete }: NoteDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // Update local state when note prop changes
  const [displayNote, setDisplayNote] = useState<Note | null>(note)

  // Sync displayNote with note prop using useEffect
  useEffect(() => {
    if (note) {
      setDisplayNote(note)
    }
  }, [note])

  if (!displayNote) return null

  const handleEdit = () => {
    setEditTitle(displayNote.title)
    setEditContent(displayNote.content)
    setIsEditing(true)
  }

  const handleSave = () => {
    const updates = {
      title: editTitle.trim() || 'Untitled Note',
      content: editContent.trim()
    }
    
    // Update parent state
    onUpdate(displayNote.id, updates)
    
    // Update local display state immediately
    setDisplayNote({
      ...displayNote,
      ...updates,
      updated_at: new Date()
    })
    
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle('')
    setEditContent('')
  }

  const handleTogglePin = () => {
    const updates = { is_pinned: !displayNote.is_pinned }
    onUpdate(displayNote.id, updates)
    setDisplayNote({
      ...displayNote,
      ...updates
    })
  }

  const handleToggleFavorite = () => {
    const updates = { is_favorited: !displayNote.is_favorited }
    onUpdate(displayNote.id, updates)
    setDisplayNote({
      ...displayNote,
      ...updates
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(displayNote.id)
      onOpenChange(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const onClose = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl font-serif font-semibold"
                  placeholder="Note title..."
                />
              ) : (
                <DialogTitle className="text-xl font-serif font-semibold text-foreground">
                  {displayNote.title}
                </DialogTitle>
              )}
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span>Created {formatDate(displayNote.created_at)}</span>
                {displayNote.updated_at.getTime() !== displayNote.created_at.getTime() && (
                  <span>Updated {formatDate(displayNote.updated_at)}</span>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center space-x-2 mt-3">
                {displayNote.is_favorited && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    <Heart className="h-3 w-3 mr-1 fill-current" />
                    Favorite
                  </span>
                )}
                {displayNote.is_pinned && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    <Pin className="h-3 w-3 mr-1 fill-current" />
                    Pinned
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePin}
                className={`${displayNote.is_pinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Pin className={`h-4 w-4 ${displayNote.is_pinned ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={`${displayNote.is_favorited ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Heart className={`h-4 w-4 ${displayNote.is_favorited ? 'fill-current' : ''}`} />
              </Button>

              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isEditing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-full resize-none font-mono text-sm"
              placeholder="Write your note content in Markdown..."
            />
          ) : (
            <div className="h-full overflow-y-auto pr-2">
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={displayNote.content} />
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}