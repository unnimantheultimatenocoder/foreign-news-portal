export interface Article {
  id: string
  title: string
  summary: string
  image_url: string | null
  source: string
  original_url: string
  published_at: string | null
  category_id: string | null
  status: string
  source_id: string | null
  created_at: string | null
  updated_at: string | null
  moderated_at: string | null
  moderated_by: string | null
  scheduled_for: string | null
}

export interface SavedArticle extends Article {
  saved_at: string
  progress?: number
  completed?: boolean
}
