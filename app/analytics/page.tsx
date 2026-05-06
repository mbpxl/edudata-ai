"use client"

import {
  AIInsights,
  Container,
  CenteredLayout,
  Charts,
  ClassOverview,
  StudentsTable,
  SmartGrouping,
} from "@/components/shared"
import { useStudentsStore } from "@/store/useStudentsStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload, ArrowLeft, Sparkles, Loader2 } from "lucide-react"

const AnalyticsPage = () => {
  const router = useRouter()
  const { students, classAnalytics, clearAll } = useStudentsStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!students || students.length === 0 || !classAnalytics) {
      setTimeout(() => {
        router.push("/upload")
      }, 2000)
    } else {
      setIsLoading(false)
    }
  }, [students, classAnalytics, router])

  const handleNewUpload = () => {
    clearAll()
    router.push("/upload")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  if (isLoading || !students || !classAnalytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Загрузка аналитики...
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {!students || students.length === 0
                ? "Нет данных. Перенаправление на страницу загрузки..."
                : "Подготовка данных..."}
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-10">
      <Container>
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              На главную
            </button>
            <button
              onClick={handleNewUpload}
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-4 py-2 text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Upload className="h-4 w-4" />
              Загрузить новый файл
            </button>
          </div>

          <CenteredLayout
            heading={"Аналитика класса"}
            text={`Проанализировано ${students.length} ${getStudentWord(students.length)} с помощью искусственного интеллекта`}
          />
        </div>

        <div className="space-y-8">
          <section>
            <ClassOverview analytics={classAnalytics} />
          </section>
          <section>
            <Charts analytics={classAnalytics} />
          </section>
          <section>
            <StudentsTable students={students} analytics={classAnalytics} />
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              ✨ Расширенный AI-анализ
            </h2>
            <div className="grid gap-6 xl:grid-cols-2">
              <AIInsights />
              <SmartGrouping />
            </div>
          </section>
        </div>

        <div className="mt-12 rounded-xl border-2 border-blue-100 bg-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Персонализированный анализ
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Нажмите на любого студента в таблице, чтобы получить детальный
                анализ его успеваемости, выявить слабые места и получить
                персонализированные рекомендации по улучшению результатов.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span>Анализ работает на базе DeepSeek AI</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}

function getStudentWord(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "студентов"
  }

  if (lastDigit === 1) {
    return "студент"
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "студента"
  }

  return "студентов"
}

export default AnalyticsPage
