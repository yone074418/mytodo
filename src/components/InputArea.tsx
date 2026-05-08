import { useState, useCallback } from 'react'
import type { TagType } from '../types'
import './InputArea.css'

interface InputAreaProps {
  onAdd: (text: string, tag: TagType) => void
  onAiBreakdown: (text: string) => Promise<void>
}

export default function InputArea({ onAdd, onAiBreakdown }: InputAreaProps) {
  const [text, setText] = useState('')
  const [tag, setTag] = useState<TagType>('default')
  const [loading, setLoading] = useState(false)

  const handleAdd = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, tag)
    setText('')
  }, [text, tag, onAdd])

  const handleAiBreakdown = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      await onAiBreakdown(trimmed)
      setText('')
    } catch (err) {
      alert(err instanceof Error ? err.message : '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }, [text, onAiBreakdown])

  return (
    <div className="input-area">
      <input
        type="text"
        placeholder="写点什么..."
        maxLength={100}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !loading) handleAdd() }}
        autoFocus
      />
      <select value={tag} onChange={e => setTag(e.target.value as TagType)}>
        <option value="default">默认</option>
        <option value="work">工作</option>
        <option value="life">生活</option>
        <option value="study">学习</option>
        <option value="urgent">紧急</option>
      </select>
      <button className="add-btn" onClick={handleAdd} disabled={loading}>记下</button>
      <button
        className={`ai-btn${loading ? ' loading' : ''}`}
        onClick={handleAiBreakdown}
        disabled={loading || !text.trim()}
      >
        {loading ? '⋯' : '✦ AI 拆解'}
      </button>
    </div>
  )
}
