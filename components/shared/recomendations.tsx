"use client"

import { StudentRecommendations } from "@/lib/types"
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui"
import {
  BookOpen,
  Video,
  FileText,
  Dumbbell,
  Book,
  Lightbulb,
  Clock,
  Sparkles,
} from "lucide-react"

interface RecommendationsProps {
  recommendations: StudentRecommendations
}

export const Recommendations = ({ recommendations }: RecommendationsProps) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video
      case "article":
        return FileText
      case "exercise":
        return Dumbbell
      case "book":
        return Book
      default:
        return BookOpen
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case "video":
        return "from-red-500 to-pink-600"
      case "article":
        return "from-blue-500 to-indigo-600"
      case "exercise":
        return "from-green-500 to-emerald-600"
      case "book":
        return "from-purple-500 to-violet-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Высокий"
      case "medium":
        return "Средний"
      case "low":
        return "Низкий"
      default:
        return priority
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "hard":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легко"
      case "medium":
        return "Средне"
      case "hard":
        return "Сложно"
      default:
        return difficulty
    }
  }

  if (
    !recommendations.topicsToStudy ||
    recommendations.topicsToStudy.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Рекомендации загружаются...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {recommendations.motivationalMessage && (
        <Card className="border-2 border-blue-200 bg-linear-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Персональное сообщение
                </h3>
                <p className="text-gray-700">
                  {recommendations.motivationalMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {recommendations.topicsToStudy.map((topic, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            <CardHeader className="border-b bg-linear-to-r from-blue-50 to-purple-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <span>
                      {topic.subject} / {topic.topic}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    {topic.reason}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getPriorityVariant(topic.priority)}>
                    {getPriorityLabel(topic.priority)}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{topic.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {topic.resources && topic.resources.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-gray-900">
                      Рекомендуемые ресурсы
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {topic.resources.map((resource, rIndex) => {
                      const Icon = getResourceIcon(resource.type)
                      return (
                        <div
                          key={rIndex}
                          className="rounded-lg border-2 border-gray-100 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`h-10 w-10 rounded-lg bg-linear-to-br ${getResourceColor(resource.type)} flex flex-shrink-0 items-center justify-center`}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="mb-1 line-clamp-1 font-medium text-gray-900">
                                {resource.title}
                              </h5>
                              <p className="mb-2 line-clamp-2 text-xs text-gray-600">
                                {resource.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}
                                >
                                  {getDifficultyLabel(resource.difficulty)}
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {resource.type === "video" && "Видео"}
                                  {resource.type === "article" && "Статья"}
                                  {resource.type === "exercise" && "Упражнение"}
                                  {resource.type === "book" && "Книга"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
