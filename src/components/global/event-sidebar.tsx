"use client";

import * as Icons from "lucide-react";
import React, { useContext } from "react";
import { Calendar } from "../ui/calendar";
import { GlobalContext } from "@/providers/global-state-provider";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function EventSidebar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { showEvent, setShowEvent } = useContext(GlobalContext);

  return (
    <div
      className={`fixed right-0 h-full w-full max-w-xs transition-all ease-linear ${
        !showEvent && "hidden"
      }`}
      onClick={() => {
        setShowEvent(false);
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`bg-sidebar ml-6 h-full p-4 lg:block`}
      >
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="flex items-center gap-2">
              <Icons.CalendarClock size={18} />
              <span className="text-sm">Events</span>
            </h2>
          </div>
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
            />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2">
            <Icons.CalendarClock size={18} />
            <span className="text-sm">All Events</span>
          </h2>
          <ScrollArea className="h-full max-h-[80vh]">
            <ul className="list-inside list-disc space-y-2 text-sm">
              {["PTA Meeting on 5th Jan hello world Hell nigeria", "Staff Meeting on 3rd Jan"].map(
                (event) => (
                  <TooltipProvider key={event}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <li className="truncate hover:cursor-pointer ...">{event}</li>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{event}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ),
              )}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
