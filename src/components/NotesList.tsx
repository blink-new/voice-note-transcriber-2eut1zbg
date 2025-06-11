import { useState, useEffect } from 'react'
import { Note } from '../types/Note'
import { NoteCard } from './NoteCard'
import { NoteDetailDialog } from './NoteDetailDialog'

interface NotesListProps {
  notes: Note[]
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onDeleteNote: (id: string) => void
  isCompact?: boolean
}

export function NotesList({ notes, onUpdateNote, onDeleteNote, isCompact = false }: NotesListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    if (selectedNote) {
      const currentSelectedNote = notes.find(note => note.id === selectedNote.id)
      if (currentSelectedNote && currentSelectedNote !== selectedNote) {
        setSelectedNote(currentSelectedNote)
      }
    }
  }, [notes, selectedNote])

  // Sort notes: pinned first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1
    if (!a.is_pinned && b.is_pinned) return 1
    const bDate = b.updated_at instanceof Date ? b.updated_at : new Date(b.updated_at)
    const aDate = a.updated_at instanceof Date ? a.updated_at : new Date(a.updated_at)
    return bDate.getTime() - aDate.getTime()
  })

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-serif font-medium text-foreground mb-2">No notes yet</h3>
        <p className="text-muted-foreground">
          Start by recording your first voice note
        </p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {sortedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={onUpdateNote}
            onDelete={onDeleteNote}
            onClick={() => setSelectedNote(note)}
            isCompact={isCompact}
          />
        ))}
      </div>

      {selectedNote && (
        <NoteDetailDialog
          note={selectedNote}
          open={!!selectedNote}
          onOpenChange={(open) => !open && setSelectedNote(null)}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      )}
    </>
  )
}