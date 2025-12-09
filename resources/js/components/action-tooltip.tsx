import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ActionTooltipProps {
  label?: string; // Backwards compatibility if I used label elsewhere
  content?: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function ActionTooltip({
  label,
  content,
  children,
  side = 'top',
  align = 'center',
}: ActionTooltipProps) {
  const text = content || label;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
