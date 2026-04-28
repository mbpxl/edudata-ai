"use client"

import { StudentRecommendations } from "@/lib/types"
import {
  CheckCircle2,
  Target,
  Calendar,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui"

interface ActionPlanProps {
  recommendations: StudentRecommendations
}

export const ActionPlan = ({ recommendations }: ActionPlanProps) => {
  if (!recommendations.actionPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>План действий загружается...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const { shortTerm, mediumTerm, longTerm } = recommendations.actionPlan

  return (
    <Card>
      <CardHeader className="border-b bg-linear-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span>План действий</span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Структурированный план достижения целей на разные временные периоды
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs defaultValue="short" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="short" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Краткосрочный</span>
              <span className="sm:hidden">1-2 нед</span>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Среднесрочный</span>
              <span className="sm:hidden">Месяц</span>
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Долгосрочный</span>
              <span className="sm:hidden">Семестр</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="short" className="space-y-4">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">
                  План на 1-2 недели
                </h3>
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
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-600 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          {goal.goal}
                        </CardTitle>
                        <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs whitespace-nowrap text-orange-600">
                          <Calendar className="h-3 w-3" />
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Шаги:
                      </h4>
                      <ul className="space-y-2">
                        {goal.steps.map((step, sIndex) => (
                          <li
                            key={sIndex}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Нет краткосрочных целей
              </p>
            )}
          </TabsContent>

          <TabsContent value="medium" className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
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
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          {goal.goal}
                        </CardTitle>
                        <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs whitespace-nowrap text-blue-600">
                          <Calendar className="h-3 w-3" />
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Шаги:
                      </h4>
                      <ul className="space-y-2">
                        {goal.steps.map((step, sIndex) => (
                          <li
                            key={sIndex}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Нет среднесрочных целей
              </p>
            )}
          </TabsContent>

          <TabsContent value="long" className="space-y-4">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">
                  План на семестр
                </h3>
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
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-violet-600 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          {goal.goal}
                        </CardTitle>
                        <div className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-xs whitespace-nowrap text-purple-600">
                          <Calendar className="h-3 w-3" />
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Шаги:
                      </h4>
                      <ul className="space-y-2">
                        {goal.steps.map((step, sIndex) => (
                          <li
                            key={sIndex}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Нет долгосрочных целей
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
