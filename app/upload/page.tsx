"use client"

import { CenteredLayout, Container } from "@/components/shared"
import {
  CheckCircle2,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useStudentsStore } from "@/store/useStudentsStore"
import { Student, ClassAnalytics } from "@/lib/types"

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState<
    "idle" | "parsing" | "analyzing" | "complete"
  >("idle")
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { setAnalyticsData } = useStudentsStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      setUploadStage("parsing")
      setUploadProgress(10)

      const formData = new FormData()
      formData.append("file", file)

      const parseResponse = await fetch("/api/parse-file", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(40)

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json()
        throw new Error(errorData.error || "Failed to parse file")
      }

      const parseResult = await parseResponse.json()

      if (!parseResult.success) {
        throw new Error(parseResult.error || "Failed to parse file")
      }

      const students: Student[] = parseResult.data
      console.log(`✅ Parsed ${students.length} students`)

      setUploadStage("analyzing")
      setUploadProgress(50)

      const analyzeResponse = await fetch("/api/analyze-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      })

      setUploadProgress(70)

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json()
        throw new Error(errorData.error || "Failed to analyze class")
      }

      const analyzeResult = await analyzeResponse.json()

      if (!analyzeResult.success) {
        throw new Error(analyzeResult.error || "Failed to analyze class")
      }

      const analytics: ClassAnalytics = analyzeResult.data
      console.log("✅ Class analysis completed")

      setUploadProgress(90)

      setUploadStage("complete")
      setAnalyticsData(students, analytics)
      setUploadProgress(100)

      setTimeout(() => {
        router.push("/analytics")
      }, 500)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Произошла ошибка при обработке файла")
      setUploadProgress(0)
      setUploadStage("idle")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadSample = () => {
    const a = document.createElement("a")
    a.href = "/test-students.csv"
    a.download = "students-sample.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getStageText = () => {
    switch (uploadStage) {
      case "parsing":
        return "Обработка файла..."
      case "analyzing":
        return "Анализ данных с помощью ИИ..."
      case "complete":
        return "Завершение..."
      default:
        return "Загрузка..."
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-10">
      <Container>
        <CenteredLayout
          className="mb-10"
          heading={"Загрузка данных студентов"}
          text={
            "Загрузите данные об успеваемости студентов в формате CSV или Excel. Наш ИИ проанализирует данные и предоставит персонализированные инсайты."
          }
        />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 bg-white shadow-xl">
            <div className="p-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-xl border-2 border-dashed p-12 text-center transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : error
                      ? "border-red-300 bg-red-50/50"
                      : "border-gray-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full ${
                      error
                        ? "bg-red-100"
                        : file
                          ? "bg-green-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {error ? (
                      <AlertCircle className="h-10 w-10 text-red-600" />
                    ) : file ? (
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    ) : (
                      <Upload className="h-10 w-10 text-blue-600" />
                    )}
                  </div>

                  {file ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} КБ
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                          Перетащите файл сюда
                        </p>
                        <p className="text-sm text-gray-500">
                          или нажмите для выбора
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-upload">
                        <button
                          type="button"
                          disabled={isUploading}
                          className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Выбрать файл
                        </button>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        Ошибка загрузки
                      </p>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {!error && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="mb-2 text-sm text-blue-900">
                    <strong>Поддерживаемые форматы:</strong> CSV, Excel (.xlsx,
                    .xls)
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Рекомендуемые колонки:</strong> ID, Имя, Математика,
                    Физика, Химия, Биология, Литература, История, Английский,
                    Посещаемость
                  </p>
                </div>
              )}

              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{getStageText()}</span>
                    <span className="font-medium text-gray-900">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-xs text-gray-500">
                    {uploadStage === "analyzing" &&
                      "Это может занять несколько секунд..."}
                  </p>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className={`flex-1 rounded-md px-4 py-3 font-medium text-white transition-all ${
                    !file || isUploading
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-linear-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  }`}
                >
                  {isUploading ? getStageText() : "Загрузить и анализировать"}
                </button>
                {file && !isUploading && (
                  <button
                    onClick={() => {
                      setFile(null)
                      setError(null)
                    }}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border-2 border-green-200 bg-green-50/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-green-900" />
              <h2 className="text-xl font-semibold text-green-900">
                Нужен образец файла?
              </h2>
            </div>
            <p className="mb-4 text-sm text-green-900">
              Скачайте наш образец CSV-файла с 20 студентами, чтобы увидеть
              ожидаемый формат и протестировать систему
            </p>
            <button
              onClick={downloadSample}
              className="rounded-md border border-green-600 px-4 py-2 font-medium text-green-700 transition-colors hover:bg-green-100"
            >
              Скачать образец файла
            </button>
          </div>
        </div>
      </Container>
    </main>
  )
}

export default UploadPage
