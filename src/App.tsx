import { useCallback } from 'react'
import Header from './components/Header'
import Stats from './components/Stats'
import InputArea from './components/InputArea'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'
import { breakdownTask } from './services/deepseek'

export default function App() {
  const {
    filter,
    setFilter,
    addTodo,
    addTodos,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    filteredTodos,
    stats,
  } = useTodos()

  const handleAiBreakdown = useCallback(async (text: string) => {
    const tasks = await breakdownTask(text)
    if (tasks.length > 0) {
      addTodos(tasks, 'default')
    }
  }, [addTodos])

  return (
    <div className="notebook">
      <Header />
      <Stats total={stats.total} done={stats.done} pending={stats.pending} />
      <InputArea onAdd={addTodo} onAiBreakdown={handleAiBreakdown} />
      <FilterBar filter={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        filter={filter}
        onToggle={toggleTodo}
        onUpdateText={updateTodoText}
        onDelete={deleteTodo}
      />
    </div>
  )
}
