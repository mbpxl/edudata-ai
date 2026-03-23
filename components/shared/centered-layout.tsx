import { cn } from "@/lib/utils";
import { Title } from ".";

type Props = {
  className?: string;
  heading: string;
  text: string;
}

export const CenteredLayout: React.FC<Props> = ({ className, heading, text }) => {
  return (
    <section className={cn(className, "text-center")}>
      <Title size="xl" className="font-extrabold mb-5" text={heading} />
      <Title size="sm" className="max-w-3xl mx-auto" text={text} />
    </section >
  )
};