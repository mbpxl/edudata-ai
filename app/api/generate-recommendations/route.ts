import { NextRequest, NextResponse } from "next/server"
import { deepseek } from "@/lib/deepseek"
import {
  StudentDetailedAnalysis,
  StudentRecommendations,
  RecommendationsResponse,
} from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { analysis } = (await request.json()) as {
      analysis: StudentDetailedAnalysis
    }

    if (!analysis || !analysis.studentId || !analysis.studentName) {
      return NextResponse.json<RecommendationsResponse>(
        { success: false, error: "Invalid analysis data provided" },
        { status: 400 }
      )
    }

    console.log(`Generating recommendations for: ${analysis.studentName}`)

    const prompt = `
Ты - опытный педагог и методист. На основе детального анализа студента создай персонализированные рекомендации.

АНАЛИЗ СТУДЕНТА:
Имя: ${analysis.studentName}
Общая характеристика: ${analysis.overallAssessment}
Текущий уровень: ${analysis.currentLevel}
Стиль обучения: ${analysis.learningStyle || "не определен"}

Сильные стороны:
${analysis.strengths.map((s) => `- ${s}`).join("\n")}

Слабые стороны:
${analysis.weaknesses.map((w) => `- ${w}`).join("\n")}

Области для работы:
${analysis.focusAreas.map((f) => `- ${f}`).join("\n")}

Проблемные темы:
${
  analysis.problemTopics
    ?.map(
      (p) =>
        `- ${p.subject} / ${p.topic}: ${p.currentGrade} → ${p.targetGrade} (приоритет: ${p.priority})`
    )
    .join("\n") || "Нет"
}

ЗАДАЧА:
Создай персонализированный план обучения с конкретными темами, ресурсами и планом действий.

Для каждой проблемной темы предложи:
1. Конкретные темы для изучения с приоритетом и временем
2. Разнообразные ресурсы (видео, статьи, упражнения, книги)
3. Подробный план действий (краткосрочный, среднесрочный, долгосрочный)
4. Мотивационное сообщение студенту

ВАЖНО: 
- Учти стиль обучения студента при выборе ресурсов
- Предложи КОНКРЕТНЫЕ названия ресурсов (не абстрактные "посмотри видео")
- Планы действий должны быть измеримыми и реалистичными
- Ответь ТОЛЬКО в формате JSON

ФОРМАТ ОТВЕТА:
{
  "studentId": "${analysis.studentId}",
  "studentName": "${analysis.studentName}",
  "topicsToStudy": [
    {
      "subject": "Название предмета",
      "topic": "Конкретная тема",
      "priority": "high/medium/low",
      "estimatedTime": "2 недели",
      "reason": "Почему важно изучить эту тему",
      "resources": [
        {
          "type": "video/article/exercise/book",
          "title": "Конкретное название ресурса",
          "description": "Краткое описание",
          "difficulty": "easy/medium/hard"
        }
      ]
    }
  ],
  "actionPlan": {
    "shortTerm": [
      {
        "goal": "Конкретная цель на 1-2 недели",
        "deadline": "через 2 недели",
        "steps": [
          "Шаг 1",
          "Шаг 2"
        ]
      }
    ],
    "mediumTerm": [
      {
        "goal": "Цель на месяц",
        "deadline": "через месяц",
        "steps": ["Шаг 1", "Шаг 2"]
      }
    ],
    "longTerm": [
      {
        "goal": "Цель на семестр",
        "deadline": "к концу семестра",
        "steps": ["Шаг 1", "Шаг 2"]
      }
    ]
  },
  "motivationalMessage": "Персональное мотивационное сообщение студенту"
}
`

    let recommendations: StudentRecommendations

    try {
      recommendations = await deepseek.chatJSON<StudentRecommendations>(
        prompt,
        {
          temperature: 0.8,
          maxTokens: 4000,
        }
      )
    } catch (aiError: any) {
      console.error("DeepSeek API error:", aiError)
      return NextResponse.json<RecommendationsResponse>(
        {
          success: false,
          error: `AI recommendation generation failed: ${aiError.message}`,
        },
        { status: 500 }
      )
    }

    if (
      !recommendations.studentId ||
      !recommendations.topicsToStudy ||
      !recommendations.actionPlan
    ) {
      console.error("Invalid recommendations structure:", recommendations)
      return NextResponse.json<RecommendationsResponse>(
        {
          success: false,
          error: "AI returned invalid data structure",
        },
        { status: 500 }
      )
    }

    console.log(`Recommendations generated for ${analysis.studentName}`)

    return NextResponse.json<RecommendationsResponse>(
      {
        success: true,
        data: recommendations,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Unexpected error in generate-recommendations:", error)
    return NextResponse.json<RecommendationsResponse>(
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
    message: "Recommendations Generation API",
    description:
      "Generates personalized study recommendations based on student analysis",
    endpoint: "/api/generate-recommendations",
    method: "POST",
    requiredBody: {
      analysis: "StudentDetailedAnalysis object",
    },
  })
}
