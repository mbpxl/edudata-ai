"use client"

import { Student, ClassAnalytics } from "@/lib/types"
import { useRouter } from "next/navigation"
import { ChevronRight, GraduationCap } from "lucide-react"
import { useMemo } from "react"
import {
  Badge,
  Button,
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

interface StudentsTableProps {
  students: Student[]
  analytics: ClassAnalytics
}

export const StudentsTable = ({ students, analytics }: StudentsTableProps) => {
  const router = useRouter()

  const studentsWithRecommendations = useMemo(() => {
    return students.map((student) => {
      const recommendation = analytics.studentsQuickRecommendations.find(
        (rec) => rec.id === student.id
      )

      const grades = Object.values(student.grades).filter(
        (g) => g !== undefined
      ) as number[]
      const averageGrade =
        grades.length > 0
          ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
          : 0

      return {
        ...student,
        recommendation: recommendation?.recommendation || "Нет рекомендаций",
        averageGrade: averageGrade.toFixed(1),
      }
    })
  }, [students, analytics])

  const handleStudentClick = (studentId: string) => {
    router.push(`/student/${studentId}`)
  }

  const getGradeBadgeVariant = (
    grade: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (grade >= 90) return "default"
    if (grade >= 75) return "secondary"
    if (grade >= 60) return "outline"
    return "destructive" // Red
  }

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return "Отлично"
    if (grade >= 75) return "Хорошо"
    if (grade >= 60) return "Удовл."
    return "Требует внимания"
  }

  return (
    <Card>
      <CardHeader className="bg-linear-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span>Список студентов</span>
        </CardTitle>
        <CardDescription>
          Нажмите на студента для детального анализа
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {studentsWithRecommendations.length > 0 ? (
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-15">№</TableHead>
                  <TableHead>Имя студента</TableHead>
                  <TableHead>Средний балл</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Рекомендация
                  </TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsWithRecommendations.map((student, index) => (
                  <TableRow
                    key={student.id}
                    onClick={() => handleStudentClick(student.id)}
                    className="group cursor-pointer transition-colors hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-purple-500 text-sm font-semibold text-white">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {student.name}
                          </div>
                          {student.email && (
                            <div className="truncate text-xs text-muted-foreground">
                              {student.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {student.averageGrade}
                        </span>
                        <Badge
                          variant={getGradeBadgeVariant(
                            parseFloat(student.averageGrade)
                          )}
                        >
                          {getGradeLabel(parseFloat(student.averageGrade))}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-md md:table-cell">
                      <div className="line-clamp-2 text-sm text-muted-foreground">
                        {student.recommendation}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="transition-all group-hover:gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStudentClick(student.id)
                        }}
                      >
                        Подробнее
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Нет данных о студентах</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
