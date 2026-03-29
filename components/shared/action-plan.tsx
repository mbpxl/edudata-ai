"use client"

import { StudentRecommendations } from "@/lib/types";
import { CheckCircle2, Target, Calendar, Zap, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "../ui";

interface ActionPlanProps {
  recommendations: StudentRecommendations;
}

export const ActionPlan = ({ recommendations }: ActionPlanProps) => {
  if (!recommendations.actionPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>План действий загружается...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const { shortTerm, mediumTerm, longTerm } = recommendations.actionPlan;

  return (
    <Card>
      <CardHeader className="bg-linear-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span>План действий</span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Структурированный план достижения целей на разные временные периоды
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs defaultValue="short" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="short" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Краткосрочный</span>
              <span className="sm:hidden">1-2 нед</span>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Среднесрочный</span>
              <span className="sm:hidden">Месяц</span>
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Долгосрочный</span>
              <span className="sm:hidden">Семестр</span>
            </TabsTrigger>
          </TabsList>

          {/* Short Term */}
          <TabsContent value="short" className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">План на 1-2 недели</h3>
              </div>
              <p className="text-sm text-orange-700">
                Быстрые результаты и закрепление базовых навыков
              </p>
            </div>

            {shortTerm && shortTerm.length > 0 ? (
              <div className="space-y-4">
                {shortTerm.map((goal, index) => (
                  <Card key={index} className="border-2 border-orange-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          {goal.goal}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Шаги:</h4>
                      <ul className="space-y-2">
                        {goal.steps.map((step, sIndex) => (
                          <li key={sIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Нет краткосрочных целей</p>
            )}
          </TabsContent>

          {/* Medium Term */}
          <TabsContent value="medium" className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">План на месяц</h3>
              </div>
              <p className="text-sm text-blue-700">
                Углубление знаний и формирование устойчивых навыков
              </p>
            </div>

            {mediumTerm && mediumTerm.length > 0 ? (
              <div className="space-y-4">
                {mediumTerm.map((goal, index) => (
                  <Card key={index} className="border-2 border-blue-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          {goal.goal}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Шаги:</h4>
                      <ul className="space-y-2">
                        {goal.steps.map((step, sIndex) => (
                          <li key={sIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Нет среднесрочных целей</p>
            )}
          </TabsContent>

          {/* Long Term */}
          <TabsContent value="long" className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">План на семестр</h3>
              </div>
              <p className="text-sm text-purple-700">
                Стратегические цели и комплексное развитие
              </p>
            </div>

            {longTerm && longTerm.length > 0 ? (
              <div className="space-y-4">
                {longTerm.map((goal, index) => (
                  <Card key={index} className="border-2 border-purple-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          {goal.goal}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Шаги:</h4>
                      <ul className="space-y-2">
                        {goal.steps.map((step, sIndex) => (
                          <li key={sIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Нет долгосрочных целей</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
