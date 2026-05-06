import { NextRequest, NextResponse } from "next/server"
import { deepseek } from "@/lib/deepseek"
import { Student, AIInsightsData, AIInsightsResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { students } = (await request.json()) as { students: Student[] }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json<AIInsightsResponse>(
        { success: false, error: "No students data provided" },
        { status: 400 }
      )
    }

    console.log(`Generating AI insights for ${students.length} students...`)

    const studentsSummary = students.map((s) => ({
      id: s.id,
      name: s.name,
      grades: s.grades,
      attendance: s.attendance,
      behavior: s.behaviorScore,
      participation: s.participationScore,
      homework: s.homeworkCompletion,
    }))

    const prompt = `Ты — опытный педагог-аналитик и специалист по data science в образовании.
Проанализируй данные класса из ${students.length} студентов и найди НЕОЧЕВИДНЫЕ закономерности.

ДАННЫЕ СТУДЕНТОВ:
${JSON.stringify(studentsSummary, null, 2)}

ЗАДАЧА:
Найди 5–7 неожиданных, нетривиальных инсайтов, которые педагог мог бы не заметить вручную.
Каждый инсайт должен быть конкретным, с числами или именами.

Типы инсайтов:
- "info"    — интересная закономерность, нейтральная
- "warning" — тревожный тренд, требует внимания
- "success" — позитивный паттерн, скрытый потенциал
- "danger"  — критическая проблема, нужна срочная реакция

Каждый инсайт должен содержать:
- Конкретный факт (процент, количество студентов, название предмета)
- Вывод или рекомендацию для педагога
- По возможности — имена затронутых студентов (не больше 5)

ВАЖНО: Ответь ТОЛЬКО в формате JSON, без пояснений и markdown.

ФОРМАТ ОТВЕТА:
{
  "insights": [
    {
      "icon": "📊",
      "type": "info",
      "title": "Короткий заголовок (до 60 символов)",
      "description": "Подробное описание с конкретными данными и рекомендацией (2–3 предложения)",
      "affectedCount": 5,
      "affectedStudents": ["Имя1", "Имя2"]
    }
  ]
}`

    let insights: AIInsightsData
    try {
      insights = await deepseek.chatJSON<AIInsightsData>(prompt, {
        temperature: 0.6,
        maxTokens: 3000,
      })
    } catch (aiError: any) {
      console.error("DeepSeek API error:", aiError)
      return NextResponse.json<AIInsightsResponse>(
        { success: false, error: `AI analysis failed: ${aiError.message}` },
        { status: 500 }
      )
    }

    if (!insights.insights || !Array.isArray(insights.insights)) {
      return NextResponse.json<AIInsightsResponse>(
        { success: false, error: "AI returned invalid data structure" },
        { status: 500 }
      )
    }

    console.log(`Generated ${insights.insights.length} insights successfully`)

    return NextResponse.json<AIInsightsResponse>(
      { success: true, data: insights },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Unexpected error in ai-insights:", error)
    return NextResponse.json<AIInsightsResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Insights API",
    description: "Finds non-obvious patterns in class data using DeepSeek AI",
    endpoint: "/api/ai-insights",
    method: "POST",
    requiredBody: { students: "Student[]" },
  })
}
