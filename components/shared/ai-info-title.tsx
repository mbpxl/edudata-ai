import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type Props = {
  className?: string;
}

export const AiInfoTitle: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, "inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6")}>
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-medium">Аналитика на основе искусственного интеллекта</span>
    </div>
  )
};
