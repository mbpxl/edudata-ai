// Student data from CSV/Excel
export interface Student {
  id: string;
  name: string;
  email?: string;
  grades: {
    [subject: string]: number | undefined; // Overall grades and topic grades
  };
  attendance?: number; // Percentage 0-100
  behaviorScore?: number; // 1-10
  participationScore?: number; // 1-10
  homeworkCompletion?: number; // Percentage 0-100
}

// Subject with detailed topics breakdown
export interface SubjectBreakdown {
  subject: string; // e.g., "math", "physics"
  overall: number; // Overall grade for the subject
  topics: Array<{
    name: string; // e.g., "algebra", "geometry"
    grade: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  }>;
  averageTopicGrade: number;
  trend: 'improving' | 'stable' | 'declining';
}

// Class-level analytics from DeepSeek
export interface ClassAnalytics {
  overview: {
    totalStudents: number;
    averageGrade: number;
    attendanceRate: number;
    subjectDistribution: {
      math: number;
      physics: number;
      humanities: number;
      sciences: number;
      [key: string]: number;
    };
    topPerformers: string[]; // Student IDs or names
    needsAttention: string[]; // Student IDs or names
  };
  studentsQuickRecommendations: Array<{
    id: string;
    name: string;
    recommendation: string;
  }>;
}

// Detailed student analysis from DeepSeek
export interface StudentDetailedAnalysis {
  studentId: string;
  studentName: string;
  overallAssessment: string; // General summary
  strengths: string[]; // What student is good at
  weaknesses: string[]; // What needs improvement
  focusAreas: string[]; // Priority areas to work on
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
  currentLevel: 'excellent' | 'good' | 'average' | 'needs_improvement' | 'critical';
  subjectBreakdown: SubjectBreakdown[]; // Detailed analysis per subject
  problemTopics: Array<{
    subject: string;
    topic: string;
    currentGrade: number;
    targetGrade: number;
    priority: 'high' | 'medium' | 'low';
    reasoning: string;
  }>;
}

// Personalized recommendations from DeepSeek
export interface StudentRecommendations {
  studentId: string;
  studentName: string;
  topicsToStudy: Array<{
    subject: string;
    topic: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: string; // e.g., "2 weeks"
    reason: string; // Why this topic
    resources: Array<{
      type: 'video' | 'article' | 'exercise' | 'book';
      title: string;
      description: string;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
  }>;
  actionPlan: {
    shortTerm: Array<{
      goal: string;
      deadline: string;
      steps: string[];
    }>;
    mediumTerm: Array<{
      goal: string;
      deadline: string;
      steps: string[];
    }>;
    longTerm: Array<{
      goal: string;
      deadline: string;
      steps: string[];
    }>;
  };
  motivationalMessage: string;
}

// API Response types
export interface ParseFileResponse {
  success: boolean;
  data?: Student[];
  error?: string;
}

export interface AnalyzeClassResponse {
  success: boolean;
  data?: ClassAnalytics;
  error?: string;
}

export interface AnalyzeStudentResponse {
  success: boolean;
  data?: StudentDetailedAnalysis;
  error?: string;
}

export interface RecommendationsResponse {
  success: boolean;
  data?: StudentRecommendations;
  error?: string;
}
