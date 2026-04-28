interface DeepSeekMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface DeepSeekResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface DeepSeekCallOptions {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export class DeepSeekClient {
  private apiKey: string
  private baseUrl: string = "https://api.deepseek.com/v1"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY || ""

    if (!this.apiKey) {
      throw new Error(
        "DeepSeek API key is required. Set DEEPSEEK_API_KEY environment variable."
      )
    }
  }

  async chat(
    userMessage: string,
    options: DeepSeekCallOptions = {}
  ): Promise<string> {
    const { temperature = 0.7, maxTokens = 4000, systemPrompt } = options

    const messages: DeepSeekMessage[] = []

    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      })
    }

    messages.push({
      role: "user",
      content: userMessage,
    })

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: "text" },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `DeepSeek API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        )
      }

      const data: DeepSeekResponse = await response.json()

      if (!data.choices || data.choices.length === 0) {
        throw new Error("DeepSeek returned no choices")
      }

      return data.choices[0].message.content
    } catch (error) {
      console.error("DeepSeek API call failed:", error)
      throw error
    }
  }

  async chatJSON<T = any>(
    userMessage: string,
    options: DeepSeekCallOptions = {}
  ): Promise<T> {
    const systemPrompt =
      options.systemPrompt ||
      "Ты - помощник, который всегда отвечает только в формате JSON. Не добавляй никаких пояснений, только валидный JSON."

    const response = await this.chat(userMessage, {
      ...options,
      systemPrompt,
    })

    try {
      let cleanedResponse = response.trim()

      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7)
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3)
      }

      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3)
      }

      cleanedResponse = cleanedResponse.trim()

      return JSON.parse(cleanedResponse) as T
    } catch (error) {
      console.error("Failed to parse DeepSeek JSON response:", response)
      throw new Error(`DeepSeek returned invalid JSON: ${error}`)
    }
  }

  async *chatStream(
    userMessage: string,
    options: DeepSeekCallOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const response = await this.chat(userMessage, options)
    yield response
  }
}

export const deepseek = new DeepSeekClient()
