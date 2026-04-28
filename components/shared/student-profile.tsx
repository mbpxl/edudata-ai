"use client"

import { Student, StudentDetailedAnalysis } from "@/lib/types"
import { Badge, Card, CardContent } from "../ui"
import {
  GraduationCap,
  Mail,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Brain,
} from "lucide-react"
import { calculateAverageGrade } from "@/lib/student-utils"

interface StudentProfileProps {
  student: Student
  analysis: StudentDetailedAnalysis | null
}

export const StudentProfile = ({ student, analysis }: StudentProfileProps) => {
  const averageGrade = calculateAverageGrade(student)

  const getLevelBadgeVariant = (level?: string) => {
    switch (level) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "average":
        return "outline"
      case "needs_improvement":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case "excellent":
        return "Отличный уровень"
      case "good":
        return "Хороший уровень"
      case "average":
        return "Средний уровень"
      case "needs_improvement":
        return "Требует улучшения"
      case "critical":
        return "Критический уровень"
      default:
        return "Оценка..."
    }
  }

  const getLearningStyleLabel = (style?: string) => {
    switch (style) {
      case "visual":
        return "Визуал"
      case "auditory":
        return "Аудиал"
      case "kinesthetic":
        return "Кинестетик"
      case "reading_writing":
        return "Чтение/Письмо"
      default:
        return "Определяется..."
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent shadow-xl">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div className="flex-1 text-white">
            <h1 className="mb-2 text-3xl font-bold">{student.name}</h1>
            {student.email && (
              <div className="mb-3 flex items-center gap-2 text-blue-100">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{student.email}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {analysis?.currentLevel && (
                <Badge
                  variant={getLevelBadgeVariant(analysis.currentLevel)}
                  className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                >
                  {getLevelLabel(analysis.currentLevel)}
                </Badge>
              )}
              {analysis?.learningStyle && (
                <Badge
                  variant="outline"
                  className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                >
                  <Brain className="mr-1 h-3 w-3" />
                  {getLearningStyleLabel(analysis.learningStyle)}
                </Badge>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
            <div className="mb-1 text-sm font-medium text-blue-100">
              Средний балл
            </div>
            <div className="text-5xl font-bold text-white">
              {averageGrade.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {student.attendance !== undefined && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-linear-to-br from-green-50 to-emerald-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">
                  Посещаемость
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {student.attendance}%
                </div>
              </div>
            </div>
          )}

          {student.behaviorScore !== undefined && (
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">
                  Поведение
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {student.behaviorScore}/10
                </div>
              </div>
            </div>
          )}

          {student.participationScore !== undefined && (
            <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-linear-to-br from-purple-50 to-pink-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">Участие</div>
                <div className="text-lg font-bold text-gray-900">
                  {student.participationScore}/10
                </div>
              </div>
            </div>
          )}

          {student.homeworkCompletion !== undefined && (
            <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-amber-600">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600">
                  Домашние
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {student.homeworkCompletion}%
                </div>
              </div>
            </div>
          )}
        </div>

        {analysis?.overallAssessment && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-purple-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  Общая характеристика
                </h3>
                <p className="text-sm text-gray-700">
                  {analysis.overallAssessment}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
