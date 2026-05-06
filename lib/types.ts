export interface Student {
  id: string
  name: string
  email?: string
  grades: {
    [subject: string]: number | undefined
  }
  attendance?: number
  behaviorScore?: number
  participationScore?: number
  homeworkCompletion?: number
}

export interface SubjectBreakdown {
  subject: string
  overall: number
  topics: Array<{
    name: string
    grade: number
    status: "excellent" | "good" | "needs_improvement" | "critical"
  }>
  averageTopicGrade: number
  trend: "improving" | "stable" | "declining"
}

export interface ClassAnalytics {
  overview: {
    totalStudents: number
    averageGrade: number
    attendanceRate: number
    subjectDistribution: {
      math: number
      physics: number
      humanities: number
      sciences: number
      [key: string]: number
    }
    topPerformers: string[]
    needsAttention: string[]
  }
  studentsQuickRecommendations: Array<{
    id: string
    name: string
    recommendation: string
  }>
}

export interface StudentDetailedAnalysis {
  studentId: string
  studentName: string
  overallAssessment: string
  strengths: string[]
  weaknesses: string[]
  focusAreas: string[]
  learningStyle?: "visual" | "auditory" | "kinesthetic" | "reading_writing"
  currentLevel:
    | "excellent"
    | "good"
    | "average"
    | "needs_improvement"
    | "critical"
  subjectBreakdown: SubjectBreakdown[]
  problemTopics: Array<{
    subject: string
    topic: string
    currentGrade: number
    targetGrade: number
    priority: "high" | "medium" | "low"
    reasoning: string
  }>
}

export interface StudentRecommendations {
  studentId: string
  studentName: string
  topicsToStudy: Array<{
    subject: string
    topic: string
    priority: "high" | "medium" | "low"
    estimatedTime: string
    reason: string
    resources: Array<{
      type: "video" | "article" | "exercise" | "book"
      title: string
      description: string
      difficulty: "easy" | "medium" | "hard"
    }>
  }>
  actionPlan: {
    shortTerm: Array<{
      goal: string
      deadline: string
      steps: string[]
    }>
    mediumTerm: Array<{
      goal: string
      deadline: string
      steps: string[]
    }>
    longTerm: Array<{
      goal: string
      deadline: string
      steps: string[]
    }>
  }
  motivationalMessage: string
}

export interface ParseFileResponse {
  success: boolean
  data?: Student[]
  error?: string
}

export interface AnalyzeClassResponse {
  success: boolean
  data?: ClassAnalytics
  error?: string
}

export interface AnalyzeStudentResponse {
  success: boolean
  data?: StudentDetailedAnalysis
  error?: string
}

export interface RecommendationsResponse {
  success: boolean
  data?: StudentRecommendations
  error?: string
}

export type InsightType = "info" | "warning" | "success" | "danger"

export interface AIInsight {
  icon: string
  type: InsightType
  title: string
  description: string
  affectedCount?: number
  affectedStudents?: string[]
}

export interface AIInsightsData {
  insights: AIInsight[]
}

export interface AIInsightsResponse {
  success: boolean
  data?: AIInsightsData
  error?: string
}

export type GroupType =
  | "peer_learning"
  | "support"
  | "olympiad"
  | "cross_subject"

export interface StudentGroup {
  type: GroupType
  icon: string
  title: string
  description: string
  students: string[] // student names
  rationale: string
}

export interface SmartGroupingData {
  groups: StudentGroup[]
  summary: string
}

export interface SmartGroupingResponse {
  success: boolean
  data?: SmartGroupingData
  error?: string
}
