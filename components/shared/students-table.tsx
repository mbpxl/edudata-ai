"use client"

import { Student, ClassAnalytics } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ChevronRight, GraduationCap } from "lucide-react";
import { useMemo } from "react";
import {
  Badge, Button,
  Card, CardContent, CardHeader, CardTitle, CardDescription, Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui";

interface StudentsTableProps {
  students: Student[];
  analytics: ClassAnalytics;
}

export const StudentsTable = ({ students, analytics }: StudentsTableProps) => {
  const router = useRouter();

  // Merge students with their recommendations
  const studentsWithRecommendations = useMemo(() => {
    return students.map((student) => {
      const recommendation = analytics.studentsQuickRecommendations.find(
        (rec) => rec.id === student.id
      );

      // Calculate average grade
      const grades = Object.values(student.grades).filter(g => g !== undefined) as number[];
      const averageGrade = grades.length > 0
        ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        : 0;

      return {
        ...student,
        recommendation: recommendation?.recommendation || "Нет рекомендаций",
        averageGrade: averageGrade.toFixed(1),
      };
    });
  }, [students, analytics]);

  const handleStudentClick = (studentId: string) => {
    router.push(`/student/${studentId}`);
  };

  const getGradeBadgeVariant = (grade: number): "default" | "secondary" | "destructive" | "outline" => {
    if (grade >= 90) return "default"; // Green-ish
    if (grade >= 75) return "secondary"; // Blue-ish
    if (grade >= 60) return "outline"; // Yellow-ish
    return "destructive"; // Red
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return "Отлично";
    if (grade >= 75) return "Хорошо";
    if (grade >= 60) return "Удовл.";
    return "Требует внимания";
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
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
                  <TableHead className="w-[60px]">№</TableHead>
                  <TableHead>Имя студента</TableHead>
                  <TableHead>Средний балл</TableHead>
                  <TableHead className="hidden md:table-cell">Рекомендация</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsWithRecommendations.map((student, index) => (
                  <TableRow
                    key={student.id}
                    onClick={() => handleStudentClick(student.id)}
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors group"
                  >
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {student.name}
                          </div>
                          {student.email && (
                            <div className="text-xs text-muted-foreground truncate">
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
                        <Badge variant={getGradeBadgeVariant(parseFloat(student.averageGrade))}>
                          {getGradeLabel(parseFloat(student.averageGrade))}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-md">
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {student.recommendation}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:gap-2 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentClick(student.id);
                        }}
                      >
                        Подробнее
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Нет данных о студентах</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
