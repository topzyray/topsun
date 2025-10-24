import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

export function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full px-4">
          <section className="relative flex cursor-pointer hover:scale-105">
            <span className="bg-meta-1 absolute -top-0.5 right-0 z-10 h-1.5 w-1.5 rounded-full bg-red-600">
              <span className="bg-meta-1 absolute -top-0.5 -right-0.5 -z-10 inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-red-700 opacity-75"></span>
            </span>
            <BellIcon />
          </section>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="h-full min-h-[15rem] w-full min-w-sm space-y-2 p-4"
      >
        <DropdownMenuItem>
          <Label className="text-lg font-semibold">All Notifications</Label>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-[15rem] max-h-[70vh]">
          {" "}
          <div className="flex h-40 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <BellIcon className="mb-2 h-6 w-6" />
            <p>You&apos;re all caught up!</p>
            <p className="text-xs">No notifications found</p>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
