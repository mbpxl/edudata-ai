"use client"

import { StudentDetailedAnalysis } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { CheckCircle2, AlertCircle, Target } from "lucide-react";

interface StrengthsWeaknessesProps {
  analysis: StudentDetailedAnalysis;
}

export const StrengthsWeaknesses = ({ analysis }: StrengthsWeaknessesProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strengths */}
      <Card>
        <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span>Сильные стороны</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.strengths.length > 0 ? (
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">Анализ сильных сторон...</p>
          )}
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card>
        <CardHeader className="bg-linear-to-r from-red-50 to-pink-50 border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span>Слабые стороны</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">Анализ слабых сторон...</p>
          )}
        </CardContent>
      </Card>

      {/* Focus Areas - Full width */}
      <Card className="lg:col-span-2">
        <CardHeader className="bg-linear-to-r from-blue-50 to-purple-50 border-b border-blue-200">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span>Приоритетные области для работы</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.focusAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.focusAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{area}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Определение приоритетных областей...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
