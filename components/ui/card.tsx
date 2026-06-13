import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-white shadow-panel", className)}>
      {children}
    </section>
  );
}
