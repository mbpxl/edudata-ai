"use client"

import { CenteredLayout, Container } from "@/components/shared"
import { CheckCircle2, Upload, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStudentsStore } from "@/store/useStudentsStore";
import { Student, ClassAnalytics } from "@/lib/types";

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'idle' | 'parsing' | 'analyzing' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setAnalyticsData } = useStudentsStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Stage 1: Parsing file (0-40%)
      setUploadStage('parsing');
      setUploadProgress(10);

      const formData = new FormData();
      formData.append('file', file);

      const parseResponse = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(40);

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || 'Failed to parse file');
      }

      const parseResult = await parseResponse.json();

      if (!parseResult.success) {
        throw new Error(parseResult.error || 'Failed to parse file');
      }

      const students: Student[] = parseResult.data;
      console.log(`✅ Parsed ${students.length} students`);

      // Stage 2: Analyzing with AI (40-90%)
      setUploadStage('analyzing');
      setUploadProgress(50);

      const analyzeResponse = await fetch('/api/analyze-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students }),
      });

      setUploadProgress(70);

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze class');
      }

      const analyzeResult = await analyzeResponse.json();

      if (!analyzeResult.success) {
        throw new Error(analyzeResult.error || 'Failed to analyze class');
      }

      const analytics: ClassAnalytics = analyzeResult.data;
      console.log('✅ Class analysis completed');

      setUploadProgress(90);

      // Stage 3: Saving data (90-100%)
      setUploadStage('complete');
      setAnalyticsData(students, analytics);
      setUploadProgress(100);

      // Redirect to analytics page
      setTimeout(() => {
        router.push('/analytics');
      }, 500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Произошла ошибка при обработке файла');
      setUploadProgress(0);
      setUploadStage('idle');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSample = () => {
    // Download the test CSV file from public folder
    const a = document.createElement('a');
    a.href = '/test-students.csv';
    a.download = 'students-sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStageText = () => {
    switch (uploadStage) {
      case 'parsing':
        return 'Обработка файла...';
      case 'analyzing':
        return 'Анализ данных с помощью ИИ...';
      case 'complete':
        return 'Завершение...';
      default:
        return 'Загрузка...';
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-10">
      <Container>
        <CenteredLayout
          className="mb-10"
          heading={"Загрузка данных студентов"}
          text={"Загрузите данные об успеваемости студентов в формате CSV или Excel. Наш ИИ проанализирует данные и предоставит персонализированные инсайты."}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-xl border-2 rounded-xl bg-white">
            <div className="p-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging
                  ? "border-blue-500 bg-blue-50"
                  : error
                    ? "border-red-300 bg-red-50/50"
                    : "border-gray-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${error
                    ? "bg-red-100"
                    : file
                      ? "bg-green-100"
                      : "bg-blue-100"
                    }`}>
                    {error ? (
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    ) : file ? (
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    ) : (
                      <Upload className="w-10 h-10 text-blue-600" />
                    )}
                  </div>

                  {file ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
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
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                          Выбрать файл
                        </button>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Ошибка загрузки</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info box */}
              {!error && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>Поддерживаемые форматы:</strong> CSV, Excel (.xlsx, .xls)
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Рекомендуемые колонки:</strong> ID, Имя, Математика, Физика, Химия, Биология, Литература, История, Английский, Посещаемость
                  </p>
                </div>
              )}

              {/* Progress bar */}
              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{getStageText()}</span>
                    <span className="text-gray-900 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {uploadStage === 'analyzing' && 'Это может занять несколько секунд...'}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className={`flex-1 py-3 px-4 rounded-md text-white font-medium transition-all ${!file || isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  {isUploading ? getStageText() : "Загрузить и анализировать"}
                </button>
                {file && !isUploading && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sample file download */}
          <div className="mt-8 border-2 border-green-200 rounded-xl bg-green-50/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-green-900" />
              <h2 className="text-xl font-semibold text-green-900">Нужен образец файла?</h2>
            </div>
            <p className="text-sm text-green-900 mb-4">
              Скачайте наш образец CSV-файла с 20 студентами, чтобы увидеть ожидаемый формат и протестировать систему
            </p>
            <button
              onClick={downloadSample}
              className="px-4 py-2 border border-green-600 rounded-md text-green-700 hover:bg-green-100 transition-colors font-medium"
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
