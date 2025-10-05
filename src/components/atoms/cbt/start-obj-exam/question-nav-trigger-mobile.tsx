import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

interface QuestionNavTriggerForMobile {
  children: React.ReactNode;
  trigger: string;
  title: string;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export default function QuestionNavTriggerForMobile({
  children,
  trigger,
  title,
  className,
  side,
}: Readonly<QuestionNavTriggerForMobile>) {
  return (
    <div className={`w-full lg:hidden ${className}`}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex w-full items-center gap-2">
            <MenuIcon className="h-4 w-4" />
            {trigger}
          </Button>
        </SheetTrigger>
        <SheetContent side={side ?? "bottom"} className="w-full overflow-y-auto sm:w-[400px]">
          <h2 className="mb-4 text-xl font-bold">{title}</h2>
          <div className="flex w-full items-center justify-center">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
