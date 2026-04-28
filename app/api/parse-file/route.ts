import { NextRequest, NextResponse } from "next/server"
import {
  parseCSV,
  parseExcel,
  validateStudentData,
  getDataStats,
} from "@/lib/parsers"
import { ParseFileResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json<ParseFileResponse>(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()
    const isCSV = fileName.endsWith(".csv")
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls")

    if (!isCSV && !isExcel) {
      return NextResponse.json<ParseFileResponse>(
        {
          success: false,
          error: "Unsupported file format. Please upload CSV or Excel file.",
        },
        { status: 400 }
      )
    }

    let students

    try {
      if (isCSV) {
        const text = await file.text()
        students = await parseCSV(text)
      } else {
        const arrayBuffer = await file.arrayBuffer()
        students = await parseExcel(arrayBuffer)
      }
    } catch (parseError: any) {
      console.error("File parsing error:", parseError)
      return NextResponse.json<ParseFileResponse>(
        {
          success: false,
          error: `Failed to parse file: ${parseError.message}`,
        },
        { status: 400 }
      )
    }

    const validation = validateStudentData(students)

    if (!validation.isValid) {
      return NextResponse.json<ParseFileResponse>(
        {
          success: false,
          error: `Invalid data: ${validation.errors.join(", ")}`,
        },
        { status: 400 }
      )
    }

    const stats = getDataStats(students)
    console.log("Parsed file successfully:", {
      fileName: file.name,
      ...stats,
      warnings: validation.warnings,
    })

    return NextResponse.json<ParseFileResponse>(
      {
        success: true,
        data: students,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Unexpected error in parse-file:", error)
    return NextResponse.json<ParseFileResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Parse File API is running",
    supportedFormats: ["CSV", "XLSX", "XLS"],
    endpoint: "/api/parse-file",
    method: "POST",
  })
}
