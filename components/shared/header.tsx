"use client"

import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Container } from "."

type Props = {
  className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className={cn(className, "w-full bg-white py-5 shadow-xs")}>
      <Container>
        <div className="flex items-center justify-between">
          {/* левый блок (лого) */}
          <Link className="flex items-center gap-2" href={"/"}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg font-semibold">EduData AI</h1>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors ${
                isActive("/")
                  ? "font-medium text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Главная
            </Link>
            <Link
              href="/upload"
              className={`transition-colors ${
                isActive("/upload")
                  ? "font-medium text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Загрузить
            </Link>
            <Link
              href="/analytics"
              className={`transition-colors ${
                isActive("/analytics")
                  ? "font-medium text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Результаты
            </Link>
          </div>
        </div>
      </Container>
    </header>
  )
}
