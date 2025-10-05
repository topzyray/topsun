import { ThemeToggle } from "@/components/atoms/mode-toggle";
import { CustomTrigger } from "@/components/global/custom-trigger";
import { Label } from "@/components/ui/label";
import { envConfig } from "@/configs/env.config";

export default function DocsHeader() {
  return (
    <header className="bg-sidebar text-sidebar-foreground fixed top-0 z-50 flex w-full items-center justify-between border-b px-2 py-2 sm:px-4">
      <section className="flex items-center gap-2">
        <CustomTrigger />
        <section className="flex items-center gap-2">
          <section className="flex flex-col">
            <Label className="text-base capitalize sm:text-lg">
              {envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL} Documentation
            </Label>
          </section>
        </section>
      </section>
      <section className="sticky right-4 flex items-center justify-end gap-1 sm:gap-2">
        <span>
          <ThemeToggle />
        </span>
      </section>
    </header>
  );
}
