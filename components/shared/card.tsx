import { Title } from "./title";
import { LucideIcon } from "lucide-react";

type Props = {
  className?: string;
  icon: LucideIcon;
  title: string;
  text: string;
  bgColor: string;
}

export const Card: React.FC<Props> = ({ className, icon: Icon, title, text, bgColor }) => {
  const borderColor = {
    blue: 'hover:border-blue-400',
    green: 'hover:border-green-400',
    purple: 'hover:border-purple-400',
    red: 'hover:border-red-400',
    yellow: 'hover:border-yellow-400',
    indigo: 'hover:border-indigo-400',
    pink: 'hover:border-pink-400',
  }[bgColor] || 'hover:border-gray-400';

  const bgColorClass = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
  }[bgColor] || 'bg-gray-500';

  return (
    <div className={`border-2 border-gray-400 rounded-2xl px-3 py-10 h-full flex flex-col ${borderColor} transition-all`}>
      <div className="flex flex-col gap-8 h-full">
        <div className={`w-14 h-14 ${bgColorClass} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <Title size="sm" className="font-semibold line-clamp-2 min-h-14" text={title} />
        <Title size="xs" className="line-clamp-3 flex-1" text={text} />
      </div>
    </div>
  )
};