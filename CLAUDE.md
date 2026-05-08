# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指引。

## 构建与开发命令

```bash
npm run dev       # 启动 Vite 开发服务器 (localhost:5173)
npm run build     # TypeScript 检查 + Vite 生产构建
npm run preview   # 本地预览生产构建
npx tsc -b        # 仅 TypeScript 类型检查（不输出文件）
```

## 架构

### 数据流

```
useTodos() hook (状态 + localStorage)
  ├── App.tsx (编排层 — 通过 props 向下传递)
  │   ├── Header        — 纯静态展示
  │   ├── Stats         — 接收 useTodos 的统计数据
  │   ├── InputArea     — 触发 onAdd / onAiBreakdown 回调
  │   ├── FilterBar     — 接收/更新 filter 状态
  │   └── TodoList
  │       └── TodoItem  — 接收 onToggle/onUpdateText/onDelete
  └── localStorage('journal_todos') — 通过 useEffect 自动持久化
```

- 状态集中在 `useTodos()` 中管理（当前范围无需 Context 或 Redux）。
- 所有数据单向流动：父组件 → 子组件，通过 props 传递。
- 变更操作通过 useCallback 包裹的处理函数传递。

### 目录结构

```
src/
  types.ts              共享类型定义 (Todo, TagType, FilterType)
  hooks/useTodos.ts     所有状态逻辑 + localStorage 持久化
  services/deepseek.ts  DeepSeek API 客户端 (breakdownTask)
  components/           每个组件有 .tsx + .css，同目录存放
    Header, Stats, InputArea, FilterBar, TodoList, TodoItem
  App.tsx               根组件，连接所有组件
  App.css               全局重置 + CSS 变量 + 手账主题
```

### 核心类型 (`src/types.ts`)

```ts
Todo { id: string; text: string; done: boolean; tag: TagType; createdAt: number }
TagType = 'default' | 'work' | 'life' | 'study' | 'urgent'
FilterType = 'all' | 'pending' | 'done'
```

## 设计约定

- **CSS 变量** 定义在 `App.css` 的 `:root` 中（`--paper`、`--ink`、`--red-seal` 等）。所有组件 CSS 应使用这些变量以保持配色一致。
- **无 UI 库** — 全部为自定义 CSS 手绘/文具风格。
- **Todo ID** 使用 `crypto.randomUUID()`（无需 uuid 库）。
- **内联编辑** — 在 TodoItem 中双击文字进入编辑，回车保存，Esc 取消。
- **AI 拆解** — 直接从浏览器调用 DeepSeek API（Vite 将 `VITE_*` 环境变量暴露给客户端）。需要 `.env` 文件中的 `VITE_DEEPSEEK_API_KEY`。

## 注意事项

- `.env` 包含真实的 API Key，已被 gitignore。使用 `.env.example` 作为模板。
- `localStorage` 的 key 为 `'journal_todos'`——旧版原生 HTML 应用和 React 版本共用此 key。
- Vite 的 `VITE_*` 环境变量在构建时编译到客户端 bundle 中（浏览器中可见）。

##
-每次在对话结束之后一个可爱的emoji