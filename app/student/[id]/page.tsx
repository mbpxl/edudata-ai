"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentsStore } from "@/store/useStudentsStore";
import { ActionPlan, Container, ProblemTopics, Recommendations, StrengthsWeaknesses, StudentProfile } from "@/components/shared";
import { StudentDetailedAnalysis, StudentRecommendations } from "@/lib/types";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, Button } from "@/components/ui";

interface StudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentPage({ params }: StudentPageProps) {
  const router = useRouter();
  const { students } = useStudentsStore();

  const [student, setStudent] = useState<any>(null);
  const [analysis, setAnalysis] = useState<StudentDetailedAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<StudentRecommendations | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paramsId, setParamsId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setParamsId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (paramsId && !student) {
      const foundStudent = students.find(s => s.id === paramsId);
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        setTimeout(() => {
          router.push('/analytics');
        }, 2000);
      }
    }
  }, [paramsId, student, students, router]);

  useEffect(() => {
    if (student && !analysis) {
      loadAnalysis();
    }
  }, [student]);

  const loadAnalysis = async () => {
    if (!student) return;

    setIsLoadingAnalysis(true);
    setError(null);

    try {
      const analysisResponse = await fetch('/api/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze student');
      }

      const analysisResult = await analysisResponse.json();

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Analysis failed');
      }

      setAnalysis(analysisResult.data);

      setIsLoadingRecommendations(true);

      const recommendationsResponse = await fetch('/api/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: analysisResult.data }),
      });

      if (!recommendationsResponse.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const recommendationsResult = await recommendationsResponse.json();

      if (!recommendationsResult.success) {
        throw new Error(recommendationsResult.error || 'Recommendations generation failed');
      }

      setRecommendations(recommendationsResult.data);

    } catch (err: any) {
      console.error('Error loading student data:', err);
      setError(err.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setIsLoadingAnalysis(false);
      setIsLoadingRecommendations(false);
    }
  };

  if (!student) {
    return (
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Загрузка студента...</p>
            <p className="text-sm text-gray-500 mt-1">
              Студент не найден. Перенаправление на страницу аналитики...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-10">
      <Container>
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/analytics')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к списку студентов
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          <StudentProfile student={student} analysis={analysis} />

          {isLoadingAnalysis && (
            <div className="flex items-center justify-center p-12 bg-white rounded-xl border-2 border-blue-100">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Анализируем данные студента...
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Искусственный интеллект проводит детальный анализ
                  </p>
                </div>
              </div>
            </div>
          )}

          {analysis && !isLoadingAnalysis && (
            <>
              <StrengthsWeaknesses analysis={analysis} />
              <ProblemTopics analysis={analysis} />
            </>
          )}

          {isLoadingRecommendations && (
            <div className="flex items-center justify-center p-12 bg-white rounded-xl border-2 border-purple-100">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Генерируем персональные рекомендации...
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Подбираем оптимальные материалы и план обучения
                  </p>
                </div>
              </div>
            </div>
          )}

          {recommendations && !isLoadingRecommendations && (
            <>
              <Recommendations recommendations={recommendations} />
              <ActionPlan recommendations={recommendations} />
            </>
          )}
        </div>
      </Container>
    </main>
  );
}