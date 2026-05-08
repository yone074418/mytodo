export type TagType = 'default' | 'work' | 'life' | 'study' | 'urgent'

export type FilterType = 'all' | 'pending' | 'done'

export interface Todo {
  id: string
  text: string
  done: boolean
  tag: TagType
  createdAt: number
}
