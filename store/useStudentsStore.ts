/**
 * Zustand store for managing students data and analytics
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, ClassAnalytics, StudentDetailedAnalysis, StudentRecommendations } from '@/lib/types';

interface StudentsStore {
  // Raw data
  students: Student[];
  classAnalytics: ClassAnalytics | null;
  
  // Selected student for detail view
  selectedStudentId: string | null;
  selectedStudentAnalysis: StudentDetailedAnalysis | null;
  selectedStudentRecommendations: StudentRecommendations | null;
  
  // Loading states
  isLoadingAnalytics: boolean;
  isLoadingStudentDetails: boolean;
  isLoadingRecommendations: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  setStudents: (students: Student[]) => void;
  setClassAnalytics: (analytics: ClassAnalytics) => void;
  setSelectedStudent: (studentId: string) => void;
  setStudentAnalysis: (analysis: StudentDetailedAnalysis) => void;
  setStudentRecommendations: (recommendations: StudentRecommendations) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
  
  // Combined setters for convenience
  setAnalyticsData: (students: Student[], analytics: ClassAnalytics) => void;
}

export const useStudentsStore = create<StudentsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      students: [],
      classAnalytics: null,
      selectedStudentId: null,
      selectedStudentAnalysis: null,
      selectedStudentRecommendations: null,
      isLoadingAnalytics: false,
      isLoadingStudentDetails: false,
      isLoadingRecommendations: false,
      error: null,
      
      // Actions
      setStudents: (students) => set({ students }),
      
      setClassAnalytics: (analytics) => set({ classAnalytics: analytics }),
      
      setSelectedStudent: (studentId) => set({ 
        selectedStudentId: studentId,
        selectedStudentAnalysis: null,
        selectedStudentRecommendations: null,
      }),
      
      setStudentAnalysis: (analysis) => set({ selectedStudentAnalysis: analysis }),
      
      setStudentRecommendations: (recommendations) => set({ 
        selectedStudentRecommendations: recommendations 
      }),
      
      setError: (error) => set({ error }),
      
      clearAll: () => set({
        students: [],
        classAnalytics: null,
        selectedStudentId: null,
        selectedStudentAnalysis: null,
        selectedStudentRecommendations: null,
        error: null,
      }),
      
      setAnalyticsData: (students, analytics) => set({
        students,
        classAnalytics: analytics,
        error: null,
      }),
    }),
    {
      name: 'students-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        students: state.students,
        classAnalytics: state.classAnalytics,
      }),
    }
  )
);

// Helper hooks for specific data
export const useStudentById = (studentId: string | null) => {
  const students = useStudentsStore((state) => state.students);
  return students.find((s) => s.id === studentId);
};

export const useQuickRecommendation = (studentId: string) => {
  const analytics = useStudentsStore((state) => state.classAnalytics);
  return analytics?.studentsQuickRecommendations.find((r) => r.id === studentId);
};
