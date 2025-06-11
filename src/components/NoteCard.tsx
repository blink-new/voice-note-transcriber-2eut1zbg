import { formatDistanceToNow } from 'date-fns'
import { Note } from '../types/Note'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Heart, Pin, MoreVertical, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { MarkdownRenderer } from './MarkdownRenderer'

interface NoteCardProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onClick: () => void
  isCompact?: boolean
}

export function NoteCard({ note, onUpdate, onDelete, onClick, isCompact = false }: NoteCardProps) {
  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdate(note.id, { is_pinned: !note.is_pinned })
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdate(note.id, { is_favorited: !note.is_favorited })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(note.id)
  }

  return (
    <Card 
      className={`note-card-hover cursor-pointer transition-all duration-200 ${
        note.is_pinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''
      } ${isCompact ? 'p-4' : ''}`}
      onClick={onClick}
    >
      <CardContent className={isCompact ? 'p-0' : 'p-6'}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="font-serif font-medium text-foreground truncate text-lg">
              <MarkdownRenderer content={note.title} compact className="line-clamp-1 [&>*]:m-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDistanceToNow(note.updated_at instanceof Date ? note.updated_at : new Date(note.updated_at), { addSuffix: true })}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {/* Pin button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePin}
              className={`h-8 w-8 p-0 ${
                note.is_pinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Pin className={`h-4 w-4 ${note.is_pinned ? 'fill-current' : ''}`} />
            </Button>

            {/* More options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleFavorite}>
                  <Heart className={`h-4 w-4 mr-2 ${note.is_favorited ? 'fill-current text-red-500' : ''}`} />
                  {note.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content preview */}
        <div className="space-y-3">
          <div className={`text-foreground/80 leading-relaxed ${
            isCompact ? 'line-clamp-2 text-sm' : 'line-clamp-3'
          }`}>
            <MarkdownRenderer 
              content={note.content} 
              compact 
              className="[&>*]:m-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" 
            />
          </div>

          {/* Tags */}
          <div className="flex items-center space-x-2">
            {note.is_favorited && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </span>
            )}
            {note.is_pinned && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                <Pin className="h-3 w-3 mr-1 fill-current" />
                Pinned
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}