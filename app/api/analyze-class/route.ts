/**
 * API Route: /api/analyze-class
 * Analyzes entire class data using DeepSeek AI
 * Returns class-level analytics and quick recommendations for each student
 */

import { NextRequest, NextResponse } from 'next/server';
import { deepseek } from '@/lib/deepseek';
import { Student, ClassAnalytics, AnalyzeClassResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json() as { students: Student[] };

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json<AnalyzeClassResponse>(
        { success: false, error: 'No students data provided' },
        { status: 400 }
      );
    }

    console.log(`Analyzing class with ${students.length} students...`);

    // Prepare data summary for DeepSeek (optimize token usage)
    const studentsSummary = students.map(s => ({
      id: s.id,
      name: s.name,
      grades: s.grades,
      attendance: s.attendance,
      behavior: s.behaviorScore,
      participation: s.participationScore,
      homework: s.homeworkCompletion
    }));

    // Create prompt for DeepSeek
    const prompt = `
Ты - опытный педагог-аналитик. Проанализируй данные класса из ${students.length} студентов.

ДАННЫЕ СТУДЕНТОВ:
${JSON.stringify(studentsSummary, null, 2)}

ЗАДАЧА:
1. Проанализируй общую успеваемость класса
2. Определи средний балл по всем предметам
3. Выяви распределение студентов по предметам (кто любит математику/физику, кто гуманитарий)
4. Определи топ-студентов и тех, кто требует особого внимания
5. Для КАЖДОГО студента дай краткую рекомендацию (1-2 предложения) - что ему нужно прямо сейчас

ВАЖНО: Ответь ТОЛЬКО в формате JSON, без дополнительных пояснений.

ФОРМАТ ОТВЕТА:
{
  "overview": {
    "totalStudents": число,
    "averageGrade": число (средний балл по всем предметам всех студентов),
    "attendanceRate": число (средняя посещаемость в процентах),
    "subjectDistribution": {
      "math": число (сколько студентов сильны в математике),
      "physics": число (сколько сильны в физике),
      "humanities": число (сколько гуманитариев),
      "sciences": число (сколько интересуются науками)
    },
    "topPerformers": ["имя1", "имя2", "имя3"] (топ-3 студента),
    "needsAttention": ["имя1", "имя2"] (студенты, требующие внимания)
  },
  "studentsQuickRecommendations": [
    {
      "id": "student-1",
      "name": "Имя студента",
      "recommendation": "Краткая рекомендация что нужно студенту прямо сейчас"
    }
  ]
}
`;

    // Call DeepSeek API
    let analytics: ClassAnalytics;

    try {
      analytics = await deepseek.chatJSON<ClassAnalytics>(prompt, {
        temperature: 0.7,
        maxTokens: 4000
      });
    } catch (aiError: any) {
      console.error('DeepSeek API error:', aiError);
      return NextResponse.json<AnalyzeClassResponse>(
        {
          success: false,
          error: `AI analysis failed: ${aiError.message}`
        },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!analytics.overview || !analytics.studentsQuickRecommendations) {
      console.error('Invalid analytics structure:', analytics);
      return NextResponse.json<AnalyzeClassResponse>(
        {
          success: false,
          error: 'AI returned invalid data structure'
        },
        { status: 500 }
      );
    }

    console.log('Class analysis completed successfully');

    return NextResponse.json<AnalyzeClassResponse>(
      {
        success: true,
        data: analytics
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Unexpected error in analyze-class:', error);
    return NextResponse.json<AnalyzeClassResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for API info
export async function GET() {
  return NextResponse.json({
    message: 'Class Analysis API',
    description: 'Analyzes student class data using DeepSeek AI',
    endpoint: '/api/analyze-class',
    method: 'POST',
    requiredBody: {
      students: 'Student[]'
    }
  });
}
