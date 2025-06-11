import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Heart, Shield, Clock, CheckCircle } from 'lucide-react'
import { TempNote } from '../lib/localStorage'

interface SignInPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: TempNote | null
  onSignIn: () => void
}

export function SignInPromptDialog({ open, onOpenChange, note, onSignIn }: SignInPromptDialogProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleSignIn = () => {
    setIsClosing(true)
    onSignIn()
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-card to-card/80 border-0 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          
          <DialogTitle className="text-xl font-serif font-medium text-foreground">
            Your note is beautifully crafted
          </DialogTitle>
          
          <DialogDescription className="text-muted-foreground leading-relaxed">
            You just created something wonderful. Right now, it's only stored temporarily on this device.
          </DialogDescription>
        </DialogHeader>

        {note && (
          <div className="my-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-foreground text-sm mb-2 truncate">
              "{note.title}"
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {note.content}
            </p>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Protect your thoughts</span> — Sign in to save this note permanently across all your devices
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Never lose progress</span> — Browser data can disappear, but your account keeps everything safe
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Seamless experience</span> — Sign in once, access your notes anywhere, anytime
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 pt-4">
          <Button 
            onClick={handleSignIn}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isClosing}
          >
            Keep My Notes Safe
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="w-full text-muted-foreground hover:text-foreground text-xs"
            disabled={isClosing}
          >
            I'll take the risk for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}