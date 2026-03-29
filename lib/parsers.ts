/**
 * File parsers for CSV and Excel student data
 * Dependencies: papaparse, xlsx
 */

import { Student } from './types';

/**
 * Parse CSV file to Student array
 */
export async function parseCSV(fileContent: string): Promise<Student[]> {
  // Using dynamic import to avoid issues with SSR
  const Papa = (await import('papaparse')).default;

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Converts numbers automatically
      complete: (results) => {
        try {
          const students = mapToStudents(results.data as any[]);
          resolve(students);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: any) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

/**
 * Parse Excel file to Student array
 */
export async function parseExcel(fileBuffer: ArrayBuffer): Promise<Student[]> {
  const XLSX = await import('xlsx');

  try {
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON with headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null
    }) as any[][];

    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }

    // First row is headers
    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1);

    // Convert to objects
    const objects = rows.map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return mapToStudents(objects);
  } catch (error) {
    throw new Error(`Excel parsing error: ${error}`);
  }
}

/**
 * Map raw data to Student objects
 * Handles various column name formats including detailed topics
 * Format: subject_overall, subject_topic (e.g., math_overall, math_algebra)
 */
function mapToStudents(rawData: any[]): Student[] {
  return rawData.map((row, index) => {
    // Extract ID (try multiple field names)
    const id = row.id || row.ID || row.student_id || row.studentId || `student-${index + 1}`;

    // Extract name (try multiple field names)
    const name = row.name || row.Name || row.fullName || row.full_name ||
      row.student_name || row.studentName || `Student ${index + 1}`;

    // Extract email
    const email = row.email || row.Email || row.emailAddress || undefined;

    // Extract grades - handle both overall and detailed topics
    const grades: Student['grades'] = {};

    // Process all columns to find grade-related fields
    Object.entries(row).forEach(([key, value]) => {
      // Skip non-grade fields
      if (['id', 'name', 'email', 'attendance', 'behavior', 'participation', 'homework'].some(
        field => key.toLowerCase().includes(field)
      )) {
        return;
      }

      // Check if it's a number (potential grade)
      const numValue = parseFloat(value as any);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        // Store with original key (e.g., "math_overall", "math_algebra")
        grades[key.toLowerCase()] = numValue;
      }
    });

    // Extract other metrics
    const attendance = parseFloat(row.attendance || row.Attendance || row.посещаемость || 0);
    const behaviorScore = parseFloat(row.behavior || row.behaviorScore || row.поведение || 0);
    const participationScore = parseFloat(row.participation || row.participationScore || row.участие || 0);
    const homeworkCompletion = parseFloat(row.homework || row.homeworkCompletion || row.домашнее_задание || 0);

    const student: Student = {
      id: String(id),
      name: String(name),
      email,
      grades,
      attendance: isNaN(attendance) ? undefined : attendance,
      behaviorScore: isNaN(behaviorScore) ? undefined : behaviorScore,
      participationScore: isNaN(participationScore) ? undefined : participationScore,
      homeworkCompletion: isNaN(homeworkCompletion) ? undefined : homeworkCompletion,
    };

    return student;
  }).filter(student => {
    // Filter out invalid students (must have at least name and some data)
    return student.name && (
      Object.keys(student.grades).length > 0 ||
      student.attendance !== undefined ||
      student.behaviorScore !== undefined
    );
  });
}

/**
 * Validate student data quality
 */
export function validateStudentData(students: Student[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (students.length === 0) {
    errors.push('No students found in file');
  }

  students.forEach((student, index) => {
    if (!student.name) {
      errors.push(`Student at row ${index + 1} has no name`);
    }

    if (Object.keys(student.grades).length === 0) {
      warnings.push(`Student "${student.name}" has no grade data`);
    }

    // Check for invalid grade values
    Object.entries(student.grades).forEach(([subject, grade]) => {
      if (grade !== undefined && (grade < 0 || grade > 100)) {
        warnings.push(`Student "${student.name}" has invalid ${subject} grade: ${grade}`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get statistics about parsed data
 */
export function getDataStats(students: Student[]): {
  totalStudents: number;
  averageGradesCount: number;
  subjectsFound: string[];
  hasAttendance: boolean;
  hasBehaviorData: boolean;
} {
  const allSubjects = new Set<string>();
  let totalGradesCount = 0;
  let hasAttendance = false;
  let hasBehaviorData = false;

  students.forEach(student => {
    Object.keys(student.grades).forEach(subject => allSubjects.add(subject));
    totalGradesCount += Object.keys(student.grades).length;

    if (student.attendance !== undefined) hasAttendance = true;
    if (student.behaviorScore !== undefined) hasBehaviorData = true;
  });

  return {
    totalStudents: students.length,
    averageGradesCount: students.length > 0 ? totalGradesCount / students.length : 0,
    subjectsFound: Array.from(allSubjects),
    hasAttendance,
    hasBehaviorData
  };
}
