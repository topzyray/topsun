"use client";

import { GlobalContext } from "@/providers/global-state-provider";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useContext } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function EventToggle() {
  const { showEvent, setShowEvent } = useContext(GlobalContext);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p onClick={() => setShowEvent((prev) => !prev)}>
            {!showEvent ? <PanelRightOpen size={35} /> : <PanelRightClose size={35} />}
            <span className="sr-only">Toggle Event</span>
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{showEvent ? "Close Event Sidebar" : "Open Event Sidebar"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
