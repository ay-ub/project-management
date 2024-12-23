import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
function PopUp({
  children,
  trigger,
}: {
  children: ReactNode;
  trigger: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent side='right'>{children}</PopoverContent>
    </Popover>
  );
}

export default PopUp;
