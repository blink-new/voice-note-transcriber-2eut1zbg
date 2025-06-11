const TEMP_NOTES_KEY = 'voice-notes-temp'

export interface TempNote {
  id: string
  title: string
  content: string
  created_at: Date
  updated_at: Date
  is_pinned: boolean
  is_favorited: boolean
}

export const localStorageService = {
  getTempNotes(): TempNote[] {
    try {
      const stored = localStorage.getItem(TEMP_NOTES_KEY)
      if (!stored) return []
      
      const parsed = JSON.parse(stored)
      return parsed.map((note: any) => ({
        ...note,
        created_at: new Date(note.created_at),
        updated_at: new Date(note.updated_at)
      }))
    } catch (error) {
      console.error('Error loading temp notes:', error)
      return []
    }
  },

  addTempNote(title: string, content: string): TempNote {
    const notes = this.getTempNotes()
    const newNote: TempNote = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      created_at: new Date(),
      updated_at: new Date(),
      is_pinned: false,
      is_favorited: false
    }
    
    notes.unshift(newNote)
    this.saveTempNotes(notes)
    return newNote
  },

  updateTempNote(id: string, updates: Partial<TempNote>): void {
    const notes = this.getTempNotes()
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updated_at: new Date() }
        : note
    )
    this.saveTempNotes(updatedNotes)
  },

  deleteTempNote(id: string): void {
    const notes = this.getTempNotes()
    const filteredNotes = notes.filter(note => note.id !== id)
    this.saveTempNotes(filteredNotes)
  },

  clearTempNotes(): void {
    localStorage.removeItem(TEMP_NOTES_KEY)
  },

  saveTempNotes(notes: TempNote[]): void {
    try {
      localStorage.setItem(TEMP_NOTES_KEY, JSON.stringify(notes))
    } catch (error) {
      console.error('Error saving temp notes:', error)
    }
  }
}