export interface Note {
  id: string
  user_id?: string
  title: string
  content: string
  created_at: Date
  updated_at: Date
  is_pinned: boolean
  is_favorited: boolean
}