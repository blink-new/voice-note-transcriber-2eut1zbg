import { useState, useEffect } from 'react'
import { VoiceRecorder } from './components/VoiceRecorder'
import { NotesList } from './components/NotesList'
import { SearchBar } from './components/SearchBar'
import { AuthForm } from './components/AuthForm'
import { IntroWidgets } from './components/IntroWidgets'
import { SignInPromptDialog } from './components/SignInPromptDialog'
import { Footer } from './components/Footer'
import { Note } from './types/Note'
import { localStorageService, TempNote } from './lib/localStorage'
import { createClient } from '@supabase/supabase-js'
import { toast, Toaster } from 'react-hot-toast'
import { Button } from './components/ui/button'
import { Loader2, LogOut, User } from 'lucide-react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [tempNotes, setTempNotes] = useState<TempNote[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'home' | 'notes'>('home')
  const [loading, setLoading] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [lastCreatedNote, setLastCreatedNote] = useState<TempNote | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadNotes()
      } else {
        setTempNotes(localStorageService.getTempNotes())
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadNotes()
        setShowAuthForm(false)
      } else {
        setNotes([])
        setTempNotes(localStorageService.getTempNotes())
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const notesWithDates = data.map(note => ({
        ...note,
        created_at: note.created_at ? new Date(note.created_at) : new Date(),
        updated_at: note.updated_at ? new Date(note.updated_at) : new Date()
      }))
      
      setNotes(notesWithDates)
    } catch (error: any) {
      toast.error('Failed to load notes')
      console.error('Error loading notes:', error)
    }
  }

  const addNote = async (title: string, content: string) => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('notes')
          .insert([{
            user_id: user.id,
            title,
            content,
            is_pinned: false,
            is_favorited: false
          }])
          .select()
          .single()

        if (error) throw error

        const newNote = {
          ...data,
          created_at: data.created_at ? new Date(data.created_at) : new Date(),
          updated_at: data.updated_at ? new Date(data.updated_at) : new Date()
        }

        setNotes(prev => [newNote, ...prev])
        toast.success('Note saved!')
      } catch (error: any) {
        toast.error('Failed to save note')
        console.error('Error adding note:', error)
      }
    } else {
      const tempNote = localStorageService.addTempNote(title, content)
      setTempNotes(prev => [tempNote, ...prev])
      setLastCreatedNote(tempNote)
      setShowSignInPrompt(true)
    }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (user && !id.startsWith('temp_')) {
      try {
        const { error } = await supabase
          .from('notes')
          .update(updates)
          .eq('id', id)

        if (error) throw error

        setNotes(prev => prev.map(note => 
          note.id === id 
            ? { ...note, ...updates, updated_at: new Date() }
            : note
        ))
        toast.success('Note updated!')
      } catch (error: any) {
        toast.error('Failed to update note')
        console.error('Error updating note:', error)
      }
    } else {
      localStorageService.updateTempNote(id, updates)
      setTempNotes(localStorageService.getTempNotes())
    }
  }

  const deleteNote = async (id: string) => {
    if (user && !id.startsWith('temp_')) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id)

        if (error) throw error

        setNotes(prev => prev.filter(note => note.id !== id))
        toast.success('Note deleted!')
      } catch (error: any) {
        toast.error('Failed to delete note')
        console.error('Error deleting note:', error)
      }
    } else {
      localStorageService.deleteTempNote(id)
      setTempNotes(localStorageService.getTempNotes())
    }
  }

  const handleTranscriptionComplete = (transcriptionData: any) => {
    try {
      if (transcriptionData && typeof transcriptionData === 'object' && transcriptionData.title && transcriptionData.content) {
        addNote(transcriptionData.title, transcriptionData.content)
      } else if (typeof transcriptionData === 'string') {
        const lines = transcriptionData.split('\n')
        const title = lines[0]?.replace(/^\*\*|\*\*$/g, '') || 'Untitled Note'
        const content = lines.slice(2).join('\n') || transcriptionData
        addNote(title, content)
      } else {
        console.warn('Invalid transcription data:', transcriptionData)
        toast.error('Invalid transcription data received')
      }
    } catch (error) {
      console.error('Error handling transcription completion:', error)
      toast.error('Failed to process transcription')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
  }

  const handleSignInClick = () => {
    setShowSignInPrompt(false)
    setShowAuthForm(true)
  }

  const allNotes = user ? notes : tempNotes
  const filteredNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const recentNotes = allNotes.slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (showAuthForm) {
    return (
      <>
        <AuthForm onAuthSuccess={() => setShowAuthForm(false)} />
        <Toaster position="top-center" />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <h1 className="text-4xl font-serif font-semibold text-foreground">
              Voice Notes
            </h1>
            <div className="flex-1 flex justify-end">
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => setShowAuthForm(true)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Capture your thoughts, one voice note at a time
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-full p-1 shadow-sm border">
            <button
              onClick={() => setView('home')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'home'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setView('notes')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'notes'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Notes ({allNotes.length})
            </button>
          </div>
        </div>

        {view === 'home' ? (
          <div className="space-y-8">
            <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />

            {recentNotes.length > 0 ? (
              <div>
                <h2 className="text-2xl font-serif font-medium text-foreground mb-6">
                  Recent Notes
                </h2>
                <NotesList
                  notes={recentNotes}
                  onUpdateNote={updateNote}
                  onDeleteNote={deleteNote}
                  isCompact
                />
              </div>
            ) : (
              <IntroWidgets />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              notesCount={allNotes.length}
            />

            <NotesList
              notes={filteredNotes}
              onUpdateNote={updateNote}
              onDeleteNote={deleteNote}
            />
          </div>
        )}
      </div>
      
      <Footer />
      
      {/* Sign In Prompt Dialog */}
      <SignInPromptDialog
        open={showSignInPrompt}
        onOpenChange={setShowSignInPrompt}
        note={lastCreatedNote}
        onSignIn={handleSignInClick}
      />
    </div>
  )
}

export default App