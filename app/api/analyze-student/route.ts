import { NextRequest, NextResponse } from "next/server"
import { deepseek } from "@/lib/deepseek"
import {
  Student,
  StudentDetailedAnalysis,
  AnalyzeStudentResponse,
} from "@/lib/types"
import {
  parseSubjectBreakdown,
  getProblemTopics,
  calculateAverageGrade,
} from "@/lib/student-utils"

export async function POST(request: NextRequest) {
  try {
    const { student } = (await request.json()) as { student: Student }

    if (!student || !student.id || !student.name) {
      return NextResponse.json<AnalyzeStudentResponse>(
        { success: false, error: "Invalid student data provided" },
        { status: 400 }
      )
    }

    console.log(`Analyzing student: ${student.name} (${student.id})`)

    const subjectBreakdown = parseSubjectBreakdown(student)
    const problemTopics = getProblemTopics(student, 75)
    const averageGrade = calculateAverageGrade(student)

    const prompt = `
Ты - опытный педагог-аналитик с 20-летним стажем. Проанализируй данные конкретного студента.

ДАННЫЕ СТУДЕНТА:
Имя: ${student.name}
Email: ${student.email || "не указан"}
Средний балл: ${averageGrade.toFixed(1)}
Посещаемость: ${student.attendance || "н/д"}%
Поведение (1-5): ${student.behaviorScore || "н/д"}
Участие в уроках (1-5): ${student.participationScore || "н/д"}
Выполнение домашних заданий: ${student.homeworkCompletion || "н/д"}%

ДЕТАЛЬНАЯ УСПЕВАЕМОСТЬ ПО ПРЕДМЕТАМ:
${subjectBreakdown
  .map(
    (s) => `
${s.subject}: ${s.overall.toFixed(1)} (средний балл)
  Темы:
${s.topics.map((t) => `    - ${t.name}: ${t.grade} (${t.status})`).join("\n")}
`
  )
  .join("\n")}

ПРОБЛЕМНЫЕ ТЕМЫ (оценка < 3.5):
${
  problemTopics.length > 0
    ? problemTopics
        .map((p) => `- ${p.subject} / ${p.topic}: ${p.grade}`)
        .join("\n")
    : "Нет проблемных тем"
}

ЗАДАЧА:
Проведи глубокий анализ студента и предоставь:
1. Общую характеристику студента
2. Сильные стороны (что получается отлично)
3. Слабые стороны (что требует внимания)
4. Приоритетные области для работы
5. Вероятный стиль обучения (visual/auditory/kinesthetic/reading_writing)
6. Текущий уровень (excellent/good/average/needs_improvement/critical)
7. Детальный анализ по каждому предмету с проблемными темами
8. Для каждой проблемной темы: приоритет (high/medium/low), целевая оценка, обоснование

ВАЖНО: Ответь ТОЛЬКО в формате JSON, без дополнительных пояснений.

ФОРМАТ ОТВЕТА:
{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "overallAssessment": "Общая характеристика студента (2-3 предложения)",
  "strengths": ["сильная сторона 1", "сильная сторона 2", ...],
  "weaknesses": ["слабая сторона 1", "слабая сторона 2", ...],
  "focusAreas": ["область для работы 1", "область для работы 2", ...],
  "learningStyle": "visual" или "auditory" или "kinesthetic" или "reading_writing",
  "currentLevel": "excellent" или "good" или "average" или "needs_improvement" или "critical",
  "subjectBreakdown": [
    {
      "subject": "Название предмета",
      "overall": число,
      "topics": [
        {
          "name": "название темы",
          "grade": число,
          "status": "excellent/good/needs_improvement/critical"
        }
      ],
      "averageTopicGrade": число,
      "trend": "improving/stable/declining"
    }
  ],
  "problemTopics": [
    {
      "subject": "Предмет",
      "topic": "Тема",
      "currentGrade": число,
      "targetGrade": число (рекомендуемая целевая оценка),
      "priority": "high/medium/low",
      "reasoning": "Почему эта тема важна"
    }
  ]
}
`

    let analysis: StudentDetailedAnalysis

    try {
      analysis = await deepseek.chatJSON<StudentDetailedAnalysis>(prompt, {
        temperature: 0.7,
        maxTokens: 4000,
      })
    } catch (aiError: any) {
      console.error("DeepSeek API error:", aiError)
      return NextResponse.json<AnalyzeStudentResponse>(
        {
          success: false,
          error: `AI analysis failed: ${aiError.message}`,
        },
        { status: 500 }
      )
    }

    if (!analysis.studentId || !analysis.studentName) {
      console.error("Invalid analysis structure:", analysis)
      return NextResponse.json<AnalyzeStudentResponse>(
        {
          success: false,
          error: "AI returned invalid data structure",
        },
        { status: 500 }
      )
    }

    console.log(`Student analysis completed for ${student.name}`)

    return NextResponse.json<AnalyzeStudentResponse>(
      {
        success: true,
        data: analysis,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Unexpected error in analyze-student:", error)
    return NextResponse.json<AnalyzeStudentResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Student Analysis API",
    description:
      "Provides detailed analysis of a specific student using DeepSeek AI",
    endpoint: "/api/analyze-student",
    method: "POST",
    requiredBody: {
      student: "Student object with detailed grade breakdown",
    },
  })
}
