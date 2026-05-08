import type { FilterType } from '../types'
import './FilterBar.css'

interface FilterBarProps {
  filter: FilterType
  onChange: (f: FilterType) => void
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '未完成' },
  { key: 'done', label: '已完成' },
]

export default function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={filter === f.key ? 'active' : ''}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
