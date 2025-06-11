import { Search } from 'lucide-react'
import { Input } from './ui/input'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  notesCount: number
}

export function SearchBar({ searchQuery, onSearchChange, notesCount }: SearchBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search your notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base bg-card border-border/50 focus:border-primary transition-colors"
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {notesCount === 0 
            ? 'No notes yet' 
            : `${notesCount} note${notesCount === 1 ? '' : 's'}`
          }
        </p>
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  )
}