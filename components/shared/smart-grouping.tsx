"use client"

import { useState } from "react"
import {
  Users,
  Loader2,
  RefreshCw,
  GraduationCap,
  Star,
  Shuffle,
  HeartHandshake,
} from "lucide-react"
import { useStudentsStore } from "@/store/useStudentsStore"
import { GroupType, StudentGroup } from "@/lib/types"

const groupConfig: Record<
  GroupType,
  {
    gradient: string
    border: string
    bg: string
    badge: string
    icon: React.ReactNode
    label: string
  }
> = {
  peer_learning: {
    gradient: "from-blue-500 to-cyan-500",
    border: "border-blue-200",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    icon: <Users className="h-5 w-5 text-white" />,
    label: "Учебные пары",
  },
  support: {
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    icon: <HeartHandshake className="h-5 w-5 text-white" />,
    label: "Группа поддержки",
  },
  olympiad: {
    gradient: "from-yellow-400 to-amber-500",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-800",
    icon: <Star className="h-5 w-5 text-white" />,
    label: "Олимпиадная команда",
  },
  cross_subject: {
    gradient: "from-teal-500 to-green-500",
    border: "border-teal-200",
    bg: "bg-teal-50",
    badge: "bg-teal-100 text-teal-700",
    icon: <Shuffle className="h-5 w-5 text-white" />,
    label: "Кросс-предметная",
  },
}

function GroupCard({ group }: { group: StudentGroup }) {
  const config = groupConfig[group.type] ?? groupConfig.peer_learning

  return (
    <div
      className={`rounded-xl border-2 ${config.border} ${config.bg} p-5 transition-all duration-200 hover:shadow-md`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} text-lg shadow-sm`}
        >
          {group.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">
              {group.title}
            </h4>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
            >
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">{group.description}</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {group.students.map((name) => (
          <span
            key={name}
            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200"
          >
            {name}
          </span>
        ))}
      </div>

      <p className="border-t border-gray-200 pt-3 text-xs leading-relaxed text-gray-600">
        💡 {group.rationale}
      </p>
    </div>
  )
}

export function SmartGrouping() {
  const {
    students,
    smartGrouping,
    isLoadingGrouping,
    setSmartGrouping,
    setIsLoadingGrouping,
  } = useStudentsStore()
  const [error, setError] = useState<string | null>(null)

  const generateGrouping = async () => {
    setIsLoadingGrouping(true)
    setError(null)

    try {
      const response = await fetch("/api/smart-grouping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      })
      const result = await response.json()

      if (!result.success) throw new Error(result.error)

      setSmartGrouping(result.data)
    } catch (err: any) {
      setError(err.message ?? "Не удалось сформировать группы")
    } finally {
      setIsLoadingGrouping(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-teal-100 bg-white p-6 shadow-lg">
      {/* Шапка */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-green-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Smart Grouping
            </h3>
            <p className="text-xs text-gray-500">
              Оптимальные группы, сформированные ИИ
            </p>
          </div>
        </div>

        <button
          onClick={generateGrouping}
          disabled={isLoadingGrouping}
          className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-green-700 hover:shadow-lg disabled:opacity-60"
        >
          {isLoadingGrouping ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Формирую...
            </>
          ) : smartGrouping ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Пересоздать
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              Создать группы
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {isLoadingGrouping && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {!isLoadingGrouping && smartGrouping && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {smartGrouping.groups.map((group, idx) => (
              <GroupCard key={idx} group={group} />
            ))}
          </div>

          {smartGrouping.summary && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              📋 {smartGrouping.summary}
            </div>
          )}
        </>
      )}

      {!isLoadingGrouping && !smartGrouping && !error && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
            <GraduationCap className="h-8 w-8 text-teal-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            Нажмите «Создать группы», чтобы ИИ сформировал
          </p>
          <p className="text-sm text-gray-400">
            оптимальные учебные группы для вашего класса
          </p>
        </div>
      )}
    </div>
  )
}
