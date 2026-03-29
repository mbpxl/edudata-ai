/**
 * Utility functions for working with detailed student grades and topics
 */

import { Student, SubjectBreakdown } from './types';

/**
 * Parse student grades into subject breakdown with topics
 */
export function parseSubjectBreakdown(student: Student): SubjectBreakdown[] {
  const subjects = new Map<string, { overall?: number; topics: Map<string, number> }>();

  // Group grades by subject
  Object.entries(student.grades).forEach(([key, value]) => {
    if (value === undefined) return;

    // Parse key format: "subject_overall" or "subject_topic"
    const parts = key.split('_');
    if (parts.length < 2) return;

    const subject = parts[0];
    const topicOrOverall = parts.slice(1).join('_');

    if (!subjects.has(subject)) {
      subjects.set(subject, { topics: new Map() });
    }

    const subjectData = subjects.get(subject)!;

    if (topicOrOverall === 'overall') {
      subjectData.overall = value;
    } else {
      subjectData.topics.set(topicOrOverall, value);
    }
  });

  // Convert to SubjectBreakdown array
  const breakdown: SubjectBreakdown[] = [];

  subjects.forEach((data, subject) => {
    const topics = Array.from(data.topics.entries()).map(([name, grade]) => ({
      name: formatTopicName(name),
      grade,
      status: getGradeStatus(grade),
    }));

    // Calculate average topic grade if no overall grade
    const overall = data.overall ?? (
      topics.length > 0
        ? topics.reduce((sum, t) => sum + t.grade, 0) / topics.length
        : 0
    );

    const averageTopicGrade = topics.length > 0
      ? topics.reduce((sum, t) => sum + t.grade, 0) / topics.length
      : overall;

    breakdown.push({
      subject: formatSubjectName(subject),
      overall,
      topics,
      averageTopicGrade,
      trend: calculateTrend(topics), // Simplified - can be enhanced with historical data
    });
  });

  return breakdown.sort((a, b) => b.overall - a.overall);
}

/**
 * Get problem topics for a student (topics with low grades)
 */
export function getProblemTopics(student: Student, threshold: number = 75): Array<{
  subject: string;
  topic: string;
  grade: number;
}> {
  const problems: Array<{ subject: string; topic: string; grade: number }> = [];

  Object.entries(student.grades).forEach(([key, value]) => {
    if (value === undefined || value >= threshold) return;

    const parts = key.split('_');
    if (parts.length < 2) return;

    const subject = parts[0];
    const topic = parts.slice(1).join('_');

    // Skip overall grades, focus on specific topics
    if (topic !== 'overall') {
      problems.push({
        subject: formatSubjectName(subject),
        topic: formatTopicName(topic),
        grade: value,
      });
    }
  });

  return problems.sort((a, b) => a.grade - b.grade);
}

/**
 * Get student's strongest subjects
 */
export function getStrongestSubjects(student: Student, count: number = 3): string[] {
  const breakdown = parseSubjectBreakdown(student);
  return breakdown
    .slice(0, count)
    .map(s => s.subject);
}

/**
 * Get student's weakest subjects
 */
export function getWeakestSubjects(student: Student, count: number = 3): string[] {
  const breakdown = parseSubjectBreakdown(student);
  return breakdown
    .slice(-count)
    .map(s => s.subject)
    .reverse();
}

/**
 * Calculate overall average grade
 */
export function calculateAverageGrade(student: Student): number {
  const overallGrades = Object.entries(student.grades)
    .filter(([key]) => key.endsWith('_overall'))
    .map(([, value]) => value)
    .filter((v): v is number => v !== undefined);

  if (overallGrades.length === 0) {
    // Fallback: calculate from all grades
    const allGrades = Object.values(student.grades).filter((v): v is number => v !== undefined);
    return allGrades.length > 0
      ? allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length
      : 0;
  }

  return overallGrades.reduce((sum, g) => sum + g, 0) / overallGrades.length;
}

// Helper functions
function formatSubjectName(subject: string): string {
  const names: Record<string, string> = {
    math: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    literature: 'Литература',
    history: 'История',
    english: 'Английский язык',
    biology: 'Биология',
  };
  return names[subject] || subject;
}

function formatTopicName(topic: string): string {
  const names: Record<string, string> = {
    algebra: 'Алгебра',
    geometry: 'Геометрия',
    calculus: 'Матанализ',
    mechanics: 'Механика',
    electricity: 'Электричество',
    optics: 'Оптика',
    organic: 'Органическая химия',
    inorganic: 'Неорганическая химия',
    poetry: 'Поэзия',
    prose: 'Проза',
    ancient: 'Древняя история',
    modern: 'Современная история',
    grammar: 'Грамматика',
    vocabulary: 'Лексика',
  };
  return names[topic] || topic;
}

function getGradeStatus(grade: number): 'excellent' | 'good' | 'needs_improvement' | 'critical' {
  if (grade >= 90) return 'excellent';
  if (grade >= 75) return 'good';
  if (grade >= 60) return 'needs_improvement';
  return 'critical';
}

function calculateTrend(topics: Array<{ name: string; grade: number }>): 'improving' | 'stable' | 'declining' {
  // Simplified trend calculation
  // In real app, compare with historical data
  const avgGrade = topics.length > 0
    ? topics.reduce((sum, t) => sum + t.grade, 0) / topics.length
    : 0;

  if (avgGrade >= 85) return 'improving';
  if (avgGrade >= 70) return 'stable';
  return 'declining';
}
