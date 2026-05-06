"use client"

import { StudentDetailedAnalysis } from "@/lib/types"
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui"
import { AlertTriangle, TrendingUp, Clock } from "lucide-react"

interface ProblemTopicsProps {
  analysis: StudentDetailedAnalysis
}

export const ProblemTopics = ({ analysis }: ProblemTopicsProps) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Высокий"
      case "medium":
        return "Средний"
      case "low":
        return "Низкий"
      default:
        return priority
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "text-green-600"
    if (grade >= 3.5) return "text-blue-600"
    if (grade >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  if (!analysis.problemTopics || analysis.problemTopics.length === 0) {
    return (
      <Card>
        <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span>Отличные результаты!</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Проблемных тем не обнаружено. Продолжайте в том же духе!
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="border-b border-orange-200 bg-linear-to-r from-orange-50 to-amber-50">
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-amber-600">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <span>Проблемные темы</span>
        </CardTitle>
        <CardDescription className="text-orange-700">
          Темы, требующие дополнительного внимания и практики
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Приоритет</TableHead>
                <TableHead>Предмет</TableHead>
                <TableHead>Тема</TableHead>
                <TableHead>Текущая оценка</TableHead>
                <TableHead>Целевая оценка</TableHead>
                <TableHead className="hidden md:table-cell">
                  Обоснование
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.problemTopics.map((topic, index) => (
                <TableRow key={index} className="hover:bg-orange-50/50">
                  <TableCell>
                    <Badge variant={getPriorityVariant(topic.priority)}>
                      {getPriorityLabel(topic.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      {topic.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">{topic.topic}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${getGradeColor(topic.currentGrade)}`}
                      >
                        {topic.currentGrade}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {topic.targetGrade}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-md md:table-cell">
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {topic.reasoning}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardContent className="border-t border-orange-100 pt-6">
        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-linear-to-r from-orange-50 to-amber-50 p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-amber-600">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="mb-1 font-semibold text-gray-900">Рекомендация</h4>
            <p className="text-sm text-gray-700">
              Начните с тем с высоким приоритетом. Они являются фундаментальными
              для дальнейшего обучения и помогут быстрее поднять общую
              успеваемость.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
