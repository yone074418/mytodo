import './Header.css'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const now = new Date()
const y = now.getFullYear()
const m = String(now.getMonth() + 1).padStart(2, '0')
const d = String(now.getDate()).padStart(2, '0')
const w = WEEKDAYS[now.getDay()]

export default function Header() {
  return (
    <div className="header">
      <div className="header-seal">代</div>
      <h1>代 办 手 账</h1>
      <div className="header-sub">
        <span className="header-date">{y} 年 {m} 月 {d} 日</span>
        <span className="header-dot">·</span>
        <span className="header-day-label">星期{w}</span>
      </div>
    </div>
  )
}
