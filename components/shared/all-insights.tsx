"use client"

import { useState } from "react"
import {
  Lightbulb,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useStudentsStore } from "@/store/useStudentsStore"
import { AIInsight, InsightType } from "@/lib/types"

const insightConfig: Record<
  InsightType,
  { border: string; bg: string; badge: string; icon: React.ReactNode }
> = {
  info: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    icon: <Info className="h-4 w-4 text-blue-500" />,
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  },
  success: {
    border: "border-green-200",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
  },
  danger: {
    border: "border-red-200",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    icon: <XCircle className="h-4 w-4 text-red-500" />,
  },
}

const typeLabel: Record<InsightType, string> = {
  info: "Закономерность",
  warning: "Тревожный тренд",
  success: "Скрытый потенциал",
  danger: "Критично",
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const config = insightConfig[insight.type] ?? insightConfig.info

  return (
    <div
      className={`rounded-xl border-2 ${config.border} ${config.bg} p-5 transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
          {insight.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}
            >
              {config.icon}
              {typeLabel[insight.type]}
            </span>
            {insight.affectedCount !== undefined && (
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-500 shadow-sm">
                {insight.affectedCount} студ.
              </span>
            )}
          </div>

          <h4 className="mb-1.5 text-sm font-semibold text-gray-900">
            {insight.title}
          </h4>
          <p className="text-sm leading-relaxed text-gray-600">
            {insight.description}
          </p>

          {insight.affectedStudents && insight.affectedStudents.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {insight.affectedStudents.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AIInsights() {
  const {
    students,
    aiInsights,
    isLoadingInsights,
    setAIInsights,
    setIsLoadingInsights,
  } = useStudentsStore()
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    setIsLoadingInsights(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      })
      const result = await response.json()

      if (!result.success) throw new Error(result.error)

      setAIInsights(result.data)
    } catch (err: any) {
      setError(err.message ?? "Не удалось получить инсайты")
    } finally {
      setIsLoadingInsights(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-purple-100 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-xs text-gray-500">
              Неочевидные закономерности, найденные ИИ
            </p>
          </div>
        </div>

        <button
          onClick={generateInsights}
          disabled={isLoadingInsights}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-lg disabled:opacity-60"
        >
          {isLoadingInsights ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Анализирую...
            </>
          ) : aiInsights ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Обновить
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" />
              Найти инсайты
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {isLoadingInsights && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {!isLoadingInsights && aiInsights && (
        <div className="space-y-3">
          {aiInsights.insights.map((insight, idx) => (
            <InsightCard key={idx} insight={insight} />
          ))}
        </div>
      )}

      {!isLoadingInsights && !aiInsights && !error && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
            <Lightbulb className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            Нажмите «Найти инсайты», чтобы ИИ обнаружил
          </p>
          <p className="text-sm text-gray-400">
            скрытые закономерности в данных класса
          </p>
        </div>
      )}
    </div>
  )
}
