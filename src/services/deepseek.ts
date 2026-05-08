const BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || ''

interface DeepSeekResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

function buildPrompt(text: string): string {
  return `你是一个任务管理助手。请将用户的任务拆解为 3-8 个具体的、可执行的子任务。
要求：
- 每个子任务独立且有意义
- 用中文动词开头（如"整理""撰写""制定"等）
- 返回 JSON 格式：{ "tasks": ["子任务1", "子任务2", ...] }
- 只返回 JSON，不要其他内容

用户任务：${text}`
}

export async function breakdownTask(text: string): Promise<string[]> {
  if (!API_KEY) {
    throw new Error('请先配置 DeepSeek API Key（在 .env 文件中设置 VITE_DEEPSEEK_API_KEY）')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个任务管理助手，擅长将复杂任务拆解为具体的子任务。' },
          { role: 'user', content: buildPrompt(text) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      throw new Error(`API 请求失败 (${res.status}): ${errBody || res.statusText}`)
    }

    const data: DeepSeekResponse = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('API 返回内容为空')
    }

    const parsed = JSON.parse(content)
    const tasks: string[] = parsed?.tasks
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error('API 返回格式异常，未能解析出子任务列表')
    }

    return tasks.slice(0, 8)
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络或稍后重试')
    }
    if (err instanceof SyntaxError) {
      throw new Error('API 返回数据解析失败')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}
