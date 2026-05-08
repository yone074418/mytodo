import type { Todo, FilterType } from '../types'
import TodoItem from './TodoItem'
import './TodoList.css'

interface TodoListProps {
  todos: Todo[]
  filter: FilterType
  onToggle: (id: string) => void
  onUpdateText: (id: string, text: string) => void
  onDelete: (id: string) => void
}

const EMPTY_MESSAGES: Record<FilterType, string> = {
  all: '今天还没有记录呢…',
  done: '还没有完成的事项',
  pending: '全部完成啦 ✦',
}

export default function TodoList({ todos, filter, onToggle, onUpdateText, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">&#9998;</div>
        <p>{EMPTY_MESSAGES[filter]}</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdateText={onUpdateText}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
