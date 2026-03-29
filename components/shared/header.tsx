"use client"

import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from ".";

type Props = {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={cn(className, "py-5 shadow-xs bg-white w-full")}>
      <Container>
        <div className="flex justify-between items-center">
          {/* левый блок (лого) */}
          <Link className="flex gap-2 items-center " href={"/"}>
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-semibold">EduData AI</h1>
          </Link>

          {/* правый блок (навигация) */}
          <div className="flex gap-8 items-center">
            <Link
              href="/"
              className={`transition-colors ${isActive("/")
                ? "text-blue-600 font-medium"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Главная
            </Link>
            <Link
              href="/upload"
              className={`transition-colors ${isActive("/upload")
                ? "text-blue-600 font-medium"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Загрузить
            </Link>
            <Link
              href="/analytics"
              className={`transition-colors ${isActive("/analytics")
                ? "text-blue-600 font-medium"
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
};