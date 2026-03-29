"use client"

import { Student, StudentDetailedAnalysis } from "@/lib/types";
import { Badge, Card, CardContent } from "../ui";
import {
  GraduationCap,
  Mail,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Brain
} from "lucide-react";
import { calculateAverageGrade } from "@/lib/student-utils";

interface StudentProfileProps {
  student: Student;
  analysis: StudentDetailedAnalysis | null;
}

export const StudentProfile = ({ student, analysis }: StudentProfileProps) => {
  const averageGrade = calculateAverageGrade(student);

  const getLevelBadgeVariant = (level?: string) => {
    switch (level) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'average': return 'outline';
      case 'needs_improvement': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'excellent': return 'Отличный уровень';
      case 'good': return 'Хороший уровень';
      case 'average': return 'Средний уровень';
      case 'needs_improvement': return 'Требует улучшения';
      case 'critical': return 'Критический уровень';
      default: return 'Оценка...';
    }
  };

  const getLearningStyleLabel = (style?: string) => {
    switch (style) {
      case 'visual': return 'Визуал';
      case 'auditory': return 'Аудиал';
      case 'kinesthetic': return 'Кинестетик';
      case 'reading_writing': return 'Чтение/Письмо';
      default: return 'Определяется...';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-purple-600 shadow-xl">
            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          {/* Main Info */}
          <div className="flex-1 text-white">
            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
            {student.email && (
              <div className="flex items-center gap-2 text-blue-100 mb-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{student.email}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {analysis?.currentLevel && (
                <Badge
                  variant={getLevelBadgeVariant(analysis.currentLevel)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  {getLevelLabel(analysis.currentLevel)}
                </Badge>
              )}
              {analysis?.learningStyle && (
                <Badge
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  {getLearningStyleLabel(analysis.learningStyle)}
                </Badge>
              )}
            </div>
          </div>

          {/* Average Grade - Large Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-sm text-blue-100 mb-1 font-medium">Средний балл</div>
            <div className="text-5xl font-bold text-white">{averageGrade.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Attendance */}
          {student.attendance !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Посещаемость</div>
                <div className="text-lg font-bold text-gray-900">{student.attendance}%</div>
              </div>
            </div>
          )}

          {/* Behavior */}
          {student.behaviorScore !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Поведение</div>
                <div className="text-lg font-bold text-gray-900">{student.behaviorScore}/10</div>
              </div>
            </div>
          )}

          {/* Participation */}
          {student.participationScore !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Участие</div>
                <div className="text-lg font-bold text-gray-900">{student.participationScore}/10</div>
              </div>
            </div>
          )}

          {/* Homework */}
          {student.homeworkCompletion !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-linear-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">Домашние</div>
                <div className="text-lg font-bold text-gray-900">{student.homeworkCompletion}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Overall Assessment */}
        {analysis?.overallAssessment && (
          <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Общая характеристика</h3>
                <p className="text-sm text-gray-700">{analysis.overallAssessment}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
