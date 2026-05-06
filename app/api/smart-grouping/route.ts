import { NextRequest, NextResponse } from "next/server"
import { deepseek } from "@/lib/deepseek"
import { Student, SmartGroupingData, SmartGroupingResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { students } = (await request.json()) as { students: Student[] }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json<SmartGroupingResponse>(
        { success: false, error: "No students data provided" },
        { status: 400 }
      )
    }

    console.log(`Generating smart grouping for ${students.length} students...`)

    const studentsSummary = students.map((s) => ({
      id: s.id,
      name: s.name,
      grades: s.grades,
      attendance: s.attendance,
      behavior: s.behaviorScore,
      participation: s.participationScore,
      homework: s.homeworkCompletion,
    }))

    const prompt = `Ты — опытный педагог и специалист по групповому обучению.
Проанализируй данные ${students.length} студентов и сформируй оптимальные учебные группы.

ДАННЫЕ СТУДЕНТОВ:
${JSON.stringify(studentsSummary, null, 2)}

ЗАДАЧА:
Создай 4 типа групп. Каждая группа должна быть конкретной — с реальными именами студентов из списка.

ТИПЫ ГРУПП (создай ровно по одной группе каждого типа):

1. "peer_learning" — Учебные пары/тройки (peer learning)
   Соедини сильного студента со слабым по конкретному предмету.
   Объясни, почему именно эта пара будет эффективна.

2. "support" — Группа поддержки
   Студенты со схожими проблемами для групповых консультаций.
   Укажи конкретный предмет или тему, по которой нужна помощь.

3. "olympiad" — Олимпиадная команда
   Топ-студенты для подготовки к соревнованиям.
   Укажи их сильные стороны.

4. "cross_subject" — Кросс-предметная группа
   Студенты с разными сильными сторонами для взаимного обмена знаниями.
   Объясни, что каждый принесёт в группу.

ВАЖНО: Ответь ТОЛЬКО в формате JSON, без пояснений и markdown.

ФОРМАТ ОТВЕТА:
{
  "groups": [
    {
      "type": "peer_learning",
      "icon": "👥",
      "title": "Название группы",
      "description": "Краткое описание цели группы (1 предложение)",
      "students": ["Имя1", "Имя2", "Имя3"],
      "rationale": "Подробное обоснование: почему именно эти студенты, что каждый получит (2–3 предложения)"
    }
  ],
  "summary": "Общий вывод о стратегии формирования групп (1–2 предложения)"
}`

    let grouping: SmartGroupingData
    try {
      grouping = await deepseek.chatJSON<SmartGroupingData>(prompt, {
        temperature: 0.5,
        maxTokens: 3000,
      })
    } catch (aiError: any) {
      console.error("DeepSeek API error:", aiError)
      return NextResponse.json<SmartGroupingResponse>(
        { success: false, error: `AI analysis failed: ${aiError.message}` },
        { status: 500 }
      )
    }

    if (!grouping.groups || !Array.isArray(grouping.groups)) {
      return NextResponse.json<SmartGroupingResponse>(
        { success: false, error: "AI returned invalid data structure" },
        { status: 500 }
      )
    }

    console.log(`Generated ${grouping.groups.length} groups successfully`)

    return NextResponse.json<SmartGroupingResponse>(
      { success: true, data: grouping },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Unexpected error in smart-grouping:", error)
    return NextResponse.json<SmartGroupingResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Smart Grouping API",
    description: "Creates optimal student groups using DeepSeek AI",
    endpoint: "/api/smart-grouping",
    method: "POST",
    requiredBody: { students: "Student[]" },
  })
}
