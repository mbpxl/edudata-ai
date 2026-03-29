"use client"

import { StudentDetailedAnalysis } from "@/lib/types";
import {
  Badge,
  Card, CardContent, CardHeader, CardTitle, CardDescription, Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui";
import { AlertTriangle, TrendingUp, Clock } from "lucide-react";

interface ProblemTopicsProps {
  analysis: StudentDetailedAnalysis;
}

export const ProblemTopics = ({ analysis }: ProblemTopicsProps) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 75) return 'text-blue-600';
    if (grade >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!analysis.problemTopics || analysis.problemTopics.length === 0) {
    return (
      <Card>
        <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span>Отличные результаты!</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Проблемных тем не обнаружено. Продолжайте в том же духе!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-linear-to-r from-orange-50 to-amber-50 border-b border-orange-200">
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
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
                <TableHead className="hidden md:table-cell">Обоснование</TableHead>
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
                    <span className="font-medium text-gray-900">{topic.subject}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700">{topic.topic}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getGradeColor(topic.currentGrade)}`}>
                        {topic.currentGrade}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {topic.targetGrade}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-md">
                    <p className="text-sm text-gray-600 line-clamp-2">{topic.reasoning}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Summary card */}
      <CardContent className="pt-6 border-t border-orange-100">
        <div className="flex items-start gap-3 p-4 bg-linear-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Рекомендация</h4>
            <p className="text-sm text-gray-700">
              Начните с тем с высоким приоритетом. Они являются фундаментальными для дальнейшего обучения
              и помогут быстрее поднять общую успеваемость.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
