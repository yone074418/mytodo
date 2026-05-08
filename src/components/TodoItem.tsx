import { useState, useRef, useEffect, useCallback } from 'react'
import type { Todo } from '../types'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onUpdateText: (id: string, text: string) => void
  onDelete: (id: string) => void
}

const TAG_LABELS: Record<string, string> = {
  work: '工作',
  life: '生活',
  study: '学习',
  urgent: '紧急',
}

export default function TodoItem({ todo, onToggle, onUpdateText, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const startEditing = useCallback(() => {
    setEditValue(todo.text)
    setEditing(true)
  }, [todo.text])

  const finishEditing = useCallback(() => {
    const val = editValue.trim()
    if (val && val !== todo.text) {
      onUpdateText(todo.id, val)
    }
    setEditing(false)
  }, [editValue, todo.id, todo.text, onUpdateText])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      finishEditing()
    }
    if (e.key === 'Escape') {
      setEditValue(todo.text)
      setEditing(false)
    }
  }, [finishEditing, todo.text])

  return (
    <li className={`todo-item${todo.done ? ' done' : ''}`}>
      <span
        className="bullet"
        title={todo.done ? '标记未完成' : '标记完成'}
        onClick={() => onToggle(todo.id)}
      />

      {editing ? (
        <input
          ref={inputRef}
          className="edit-input"
          type="text"
          value={editValue}
          maxLength={100}
          onChange={e => setEditValue(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="content" onDoubleClick={startEditing}>
          {todo.text}
        </span>
      )}

      {todo.tag !== 'default' && (
        <span className={`tag tag-${todo.tag}`}>
          {TAG_LABELS[todo.tag] || todo.tag}
        </span>
      )}

      <span className="actions">
        <button title="编辑" onClick={startEditing}>✎</button>
        <button className="del-btn" title="删除" onClick={() => onDelete(todo.id)}>✕</button>
      </span>
    </li>
  )
}
