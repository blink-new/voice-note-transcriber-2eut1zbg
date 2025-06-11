import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Mic, Square, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void
}

export function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        stream.getTracks().forEach(track => track.stop())
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // Removed toast.success('Recording started!')
    } catch (error) {
      console.error('Error starting recording:', error)
      // Removed toast.error('Failed to start recording. Please check microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    // Helper function to convert Blob to base64
    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
            resolve(reader.result.split(',')[1]);
          } else {
            reject(new Error("Failed to read blob as base64 string"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    try {
      const base64Audio = await blobToBase64(audioBlob);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase URL or Anon Key is not defined in environment variables.");
        setIsProcessing(false);
        return;
      }

      const functionUrl = `${supabaseUrl}/functions/v1/transcribe-and-format`

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ audio: base64Audio }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.title && data.content) {
        // Pass the structured data to the parent
        onTranscriptionComplete(data)
      } else if (data.title === "Empty Note") {
        onTranscriptionComplete({ title: "Empty Note", content: "No speech detected or empty note" })
      } else {
        throw new Error('Invalid response from server')
      }

    } catch (error) {
      console.error('Error processing audio:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="note-card-hover">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-medium text-foreground">
              Start a New Note
            </h2>
            <p className="text-muted-foreground">
              Press the button and start speaking your thoughts
            </p>
          </div>

          {/* Recording Button */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              size="lg"
              className={`h-20 w-20 rounded-full text-white font-medium transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 recording-pulse'
                  : 'bg-primary hover:bg-primary/90'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isRecording ? (
                <Square className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>

            {/* Recording Status */}
            {isRecording && (
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600">Recording</span>
                </div>
                <div className="text-xl font-mono font-medium text-foreground">
                  {formatTime(recordingTime)}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="text-center space-y-1">
                <span className="text-sm font-medium text-primary">Processing...</span>
                <p className="text-xs text-muted-foreground">
                  Transcribing your voice note
                </p>
              </div>
            )}

            {!isRecording && !isProcessing && (
              <p className="text-sm text-muted-foreground max-w-md">
                Tap to start recording. Your voice will be automatically transcribed and saved as a note.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}