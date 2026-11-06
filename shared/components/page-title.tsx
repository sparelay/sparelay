import { cn } from "cn";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: Props) {
  return <h1 className={cn("text-xl font-bold", className)}>{children}</h1>;
}
