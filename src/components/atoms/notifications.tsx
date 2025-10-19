import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

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
      <DropdownMenuContent align="start" className="min-h-[15rem] w-full space-y-2 p-4">
        <DropdownMenuItem>
          <Label>Available Notifications</Label>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>No notification yet.</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
