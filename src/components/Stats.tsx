import './Stats.css'

interface StatsProps {
  total: number
  done: number
  pending: number
}

export default function Stats({ total, done, pending }: StatsProps) {
  return (
    <div className="stats">
      <span>全部 <span className="stats-num">{total}</span></span>
      <span>已完成 <span className="stats-num">{done}</span></span>
      <span>未完成 <span className="stats-num">{pending}</span></span>
    </div>
  )
}
