import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ToolTipProps {
  trigger: React.ReactNode;
  message: React.ReactNode | string;
}

export default function TooltipComponent({ trigger, message, ...props }: ToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild suppressHydrationWarning {...props}>
          {trigger}
        </TooltipTrigger>
        <TooltipContent {...props}>
          <span>{message}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
