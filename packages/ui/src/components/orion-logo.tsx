import { cn } from "@workspace/ui/lib/utils";
import { Rocket } from "lucide-react";

interface OrionLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function OrionLogo({
  className,
  showText = true,
  size = "md",
}: OrionLogoProps) {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Simple rocket icon */}
      <Rocket className={cn("text-foreground", iconSizes[size])} />

      {showText && (
        <span className={cn("font-bold tracking-tight", textSizes[size])}>
          Orion<span className="font-extrabold">Kit</span>
        </span>
      )}
    </div>
  );
}
