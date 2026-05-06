"use client"

import { ClassAnalytics } from "@/lib/types"
import { BarChart3, PieChart as PieChartIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui"

interface ChartsProps {
  analytics: ClassAnalytics
}

export const Charts = ({ analytics }: ChartsProps) => {
  const { overview } = analytics
  const { subjectDistribution } = overview

  const chartData = Object.entries(subjectDistribution).map(
    ([name, count]) => ({
      subject: getSubjectLabel(name),
      count,
      fill: getChartColor(name),
    })
  )

  const sortedData = [...chartData].sort((a, b) => b.count - a.count)

  const totalCount = sortedData.reduce((sum, item) => sum + item.count, 0)

  const chartConfig = {
    count: {
      label: "Студентов",
    },
  }

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.count / totalCount) * 100).toFixed(0)
    return `${percent}%`
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span>Распределение по интересам</span>
          </CardTitle>
          <CardDescription>
            Количество студентов заинтересованных в каждом направлении
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="subject"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
            <span>Популярные направления</span>
          </CardTitle>
          <CardDescription>
            Процентное соотношение интересов студентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => entry.payload.subject}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function getSubjectLabel(name: string): string {
  const labels: Record<string, string> = {
    math: "Математика",
    physics: "Физика",
    humanities: "Гуманитарные",
    sciences: "Науки",
    chemistry: "Химия",
    biology: "Биология",
    literature: "Литература",
    history: "История",
    english: "Английский",
  }
  return labels[name] || name
}

function getChartColor(name: string): string {
  const colors: Record<string, string> = {
    math: "hsl(221, 83%, 53%)",
    physics: "hsl(262, 83%, 58%)",
    humanities: "hsl(340, 82%, 52%)",
    sciences: "hsl(142, 71%, 45%)",
    chemistry: "hsl(25, 95%, 53%)",
    biology: "hsl(173, 58%, 39%)",
    literature: "hsl(199, 89%, 48%)",
    history: "hsl(239, 84%, 67%)",
    english: "hsl(48, 96%, 53%)",
  }
  return colors[name] || "hsl(0, 0%, 50%)"
}
