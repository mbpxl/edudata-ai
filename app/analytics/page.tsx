"use client"

import { Container, CenteredLayout, Charts, ClassOverview, StudentsTable } from "@/components/shared";
import { useStudentsStore } from "@/store/useStudentsStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Upload, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const AnalyticsPage = () => {
  const router = useRouter();
  const { students, classAnalytics, clearAll } = useStudentsStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have data
    if (!students || students.length === 0 || !classAnalytics) {
      // Redirect to upload if no data
      setTimeout(() => {
        router.push('/upload');
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, [students, classAnalytics, router]);

  const handleNewUpload = () => {
    clearAll();
    router.push('/upload');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Loading state
  if (isLoading || !students || !classAnalytics) {
    return (
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Загрузка аналитики...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {!students || students.length === 0
                ? "Нет данных. Перенаправление на страницу загрузки..."
                : "Подготовка данных..."
              }
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-10">
      <Container>
        {/* Header with actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </button>
            <button
              onClick={handleNewUpload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4" />
              Загрузить новый файл
            </button>
          </div>

          <CenteredLayout
            heading={"Аналитика класса"}
            text={`Проанализировано ${students.length} ${getStudentWord(students.length)} с помощью искусственного интеллекта`}
          />
        </div>

        <div className="space-y-8">
          {/* Class Overview - Metrics cards */}
          <section>
            <ClassOverview analytics={classAnalytics} />
          </section>

          {/* Charts - Distribution visualization */}
          <section>
            <Charts analytics={classAnalytics} />
          </section>

          {/* Students Table */}
          <section>
            <StudentsTable students={students} analytics={classAnalytics} />
          </section>
        </div>

        {/* Footer info */}
        <div className="mt-12 p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Персонализированный анализ
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Нажмите на любого студента в таблице, чтобы получить детальный анализ его успеваемости,
                выявить слабые места и получить персонализированные рекомендации по улучшению результатов.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Анализ работает на базе DeepSeek AI</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

// Helper function for proper Russian word form
function getStudentWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "студентов";
  }

  if (lastDigit === 1) {
    return "студент";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "студента";
  }

  return "студентов";
}

export default AnalyticsPage;
