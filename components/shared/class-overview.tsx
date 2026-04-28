"use client"

import { ClassAnalytics } from "@/lib/types"
import { Users, TrendingUp, Calendar, Award, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui"

interface ClassOverviewProps {
  analytics: ClassAnalytics
}

export const ClassOverview = ({ analytics }: ClassOverviewProps) => {
  const { overview } = analytics

  const metrics = [
    {
      label: "Всего студентов",
      value: overview.totalStudents,
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Средний балл",
      value: overview.averageGrade.toFixed(1),
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Посещаемость",
      value: `${overview.attendanceRate.toFixed(0)}%`,
      icon: Calendar,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card
              key={metric.label}
              className="transition-shadow hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </div>
                  <div
                    className={`h-14 w-14 rounded-xl ${metric.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`h-7 w-7 ${metric.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                <Award className="h-5 w-5 text-white" />
              </div>
              <span>Лучшие студенты</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overview.topPerformers.slice(0, 5).map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{student}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-pink-500">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <span>Требуют внимания</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overview.needsAttention.length > 0 ? (
                overview.needsAttention.slice(0, 5).map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-pink-500">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{student}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Все студенты показывают хорошие результаты! 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
