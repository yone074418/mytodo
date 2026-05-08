import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Todo, TagType, FilterType } from '../types'

const STORAGE_KEY = 'journal_todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((text: string, tag: TagType) => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      done: false,
      tag,
      createdAt: Date.now(),
    }
    setTodos(prev => [todo, ...prev])
    setFilter('all')
  }, [])

  const addTodos = useCallback((texts: string[], tag: TagType) => {
    const now = Date.now()
    const todos: Todo[] = texts.map((text, i) => ({
      id: crypto.randomUUID(),
      text,
      done: false,
      tag,
      createdAt: now + i,
    }))
    setTodos(prev => [...todos, ...prev])
    setFilter('all')
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateTodoText = useCallback((id: string, text: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }, [])

  const filteredTodos = useMemo(
    () => todos.filter(t => {
      if (filter === 'done') return t.done
      if (filter === 'pending') return !t.done
      return true
    }),
    [todos, filter],
  )

  const stats = useMemo(() => {
    const total = todos.length
    const done = todos.filter(t => t.done).length
    return { total, done, pending: total - done }
  }, [todos])

  return {
    todos,
    filter,
    setFilter,
    addTodo,
    addTodos,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    filteredTodos,
    stats,
  }
}
