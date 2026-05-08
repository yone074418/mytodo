import './Stats.css'

interface StatsProps {
  total: number
  done: number
  pending: number
}

export default function Stats({ total, done, pending }: StatsProps) {
  return (
    <div className="stats">
      <div className="stats-item">
        <span className="stats-num">{total}</span>
        <span className="stats-label">全部</span>
      </div>
      <div className="stats-item">
        <span className="stats-num">{done}</span>
        <span className="stats-label">已完成</span>
      </div>
      <div className="stats-item">
        <span className="stats-num">{pending}</span>
        <span className="stats-label">未完成</span>
      </div>
    </div>
  )
}
