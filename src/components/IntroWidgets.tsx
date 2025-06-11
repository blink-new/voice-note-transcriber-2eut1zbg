import { Card, CardContent } from './ui/card'
import { Mic, Search, Heart, Pin, Clock, Sparkles } from 'lucide-react'

export function IntroWidgets() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-serif font-medium text-foreground">
          Transform Your Thoughts Into Notes
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Speak naturally and watch your ideas become beautifully formatted notes. 
          Perfect for capturing inspiration, taking meeting notes, or journaling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto">
              <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-serif font-medium text-foreground">Smart Transcription</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI converts your voice to clean, formatted text with automatic punctuation and structure.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-serif font-medium text-foreground">Powerful Search</h3>
            <p className="text-sm text-muted-foreground">
              Find any note instantly by searching through titles and content. Never lose a thought again.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-serif font-medium text-foreground">Organize & Favorite</h3>
            <p className="text-sm text-muted-foreground">
              Mark important notes as favorites and pin urgent ones to the top for easy access.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto">
              <Pin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-serif font-medium text-foreground">Pin Important Notes</h3>
            <p className="text-sm text-muted-foreground">
              Keep your most important notes at the top of your list for quick reference.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-serif font-medium text-foreground">Auto-Save Timeline</h3>
            <p className="text-sm text-muted-foreground">
              All notes are automatically saved with timestamps, creating a timeline of your thoughts.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="font-serif font-medium text-foreground">Smart Formatting</h3>
            <p className="text-sm text-muted-foreground">
              AI automatically structures your notes with proper headings, lists, and formatting.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4 pt-8">
        <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
          <h3 className="text-xl font-serif font-medium text-foreground mb-2">
            Ready to get started?
          </h3>
          <p className="text-muted-foreground">
            Click the microphone above to record your first note and experience the magic!
          </p>
        </div>
      </div>
    </div>
  )
}