import { Student, SubjectBreakdown } from "./types"

export function parseSubjectBreakdown(student: Student): SubjectBreakdown[] {
  const subjects = new Map<
    string,
    { overall?: number; topics: Map<string, number> }
  >()

  Object.entries(student.grades).forEach(([key, value]) => {
    if (value === undefined) return

    const parts = key.split("_")
    if (parts.length < 2) return

    const subject = parts[0]
    const topicOrOverall = parts.slice(1).join("_")

    if (!subjects.has(subject)) {
      subjects.set(subject, { topics: new Map() })
    }

    const subjectData = subjects.get(subject)!

    if (topicOrOverall === "overall") {
      subjectData.overall = value
    } else {
      subjectData.topics.set(topicOrOverall, value)
    }
  })

  const breakdown: SubjectBreakdown[] = []

  subjects.forEach((data, subject) => {
    const topics = Array.from(data.topics.entries()).map(([name, grade]) => ({
      name: formatTopicName(name),
      grade,
      status: getGradeStatus(grade),
    }))

    const overall =
      data.overall ??
      (topics.length > 0
        ? topics.reduce((sum, t) => sum + t.grade, 0) / topics.length
        : 0)

    const averageTopicGrade =
      topics.length > 0
        ? topics.reduce((sum, t) => sum + t.grade, 0) / topics.length
        : overall

    breakdown.push({
      subject: formatSubjectName(subject),
      overall,
      topics,
      averageTopicGrade,
      trend: calculateTrend(topics),
    })
  })

  return breakdown.sort((a, b) => b.overall - a.overall)
}

export function getProblemTopics(
  student: Student,
  threshold: number = 75
): Array<{
  subject: string
  topic: string
  grade: number
}> {
  const problems: Array<{ subject: string; topic: string; grade: number }> = []

  Object.entries(student.grades).forEach(([key, value]) => {
    if (value === undefined || value >= threshold) return

    const parts = key.split("_")
    if (parts.length < 2) return

    const subject = parts[0]
    const topic = parts.slice(1).join("_")

    if (topic !== "overall") {
      problems.push({
        subject: formatSubjectName(subject),
        topic: formatTopicName(topic),
        grade: value,
      })
    }
  })

  return problems.sort((a, b) => a.grade - b.grade)
}

export function getStrongestSubjects(
  student: Student,
  count: number = 3
): string[] {
  const breakdown = parseSubjectBreakdown(student)
  return breakdown.slice(0, count).map((s) => s.subject)
}

export function getWeakestSubjects(
  student: Student,
  count: number = 3
): string[] {
  const breakdown = parseSubjectBreakdown(student)
  return breakdown
    .slice(-count)
    .map((s) => s.subject)
    .reverse()
}

export function calculateAverageGrade(student: Student): number {
  const overallGrades = Object.entries(student.grades)
    .filter(([key]) => key.endsWith("_overall"))
    .map(([, value]) => value)
    .filter((v): v is number => v !== undefined)

  if (overallGrades.length === 0) {
    const allGrades = Object.values(student.grades).filter(
      (v): v is number => v !== undefined
    )
    return allGrades.length > 0
      ? allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length
      : 0
  }

  return overallGrades.reduce((sum, g) => sum + g, 0) / overallGrades.length
}

function formatSubjectName(subject: string): string {
  const names: Record<string, string> = {
    math: "Математика",
    physics: "Физика",
    chemistry: "Химия",
    literature: "Литература",
    history: "История",
    english: "Английский язык",
    biology: "Биология",
  }
  return names[subject] || subject
}

function formatTopicName(topic: string): string {
  const names: Record<string, string> = {
    algebra: "Алгебра",
    geometry: "Геометрия",
    calculus: "Матанализ",
    mechanics: "Механика",
    electricity: "Электричество",
    optics: "Оптика",
    organic: "Органическая химия",
    inorganic: "Неорганическая химия",
    poetry: "Поэзия",
    prose: "Проза",
    ancient: "Древняя история",
    modern: "Современная история",
    grammar: "Грамматика",
    vocabulary: "Лексика",
  }
  return names[topic] || topic
}

function getGradeStatus(
  grade: number
): "excellent" | "good" | "needs_improvement" | "critical" {
  if (grade >= 90) return "excellent"
  if (grade >= 75) return "good"
  if (grade >= 60) return "needs_improvement"
  return "critical"
}

function calculateTrend(
  topics: Array<{ name: string; grade: number }>
): "improving" | "stable" | "declining" {
  const avgGrade =
    topics.length > 0
      ? topics.reduce((sum, t) => sum + t.grade, 0) / topics.length
      : 0

  if (avgGrade >= 85) return "improving"
  if (avgGrade >= 70) return "stable"
  return "declining"
}
