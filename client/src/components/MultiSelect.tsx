import { X } from "lucide-react";
import { Badge } from "./ui/badge";

function MultiSelect() {
  return (
    <div className="w-full border p-2 rounded-sm flex items-center justify-start gap-1 flex-wrap">
      <DependencyOn />
      <DependencyOn />
      <DependencyOn />
      <DependencyOn />
      <DependencyOn />
    </div>
  );
}

export default MultiSelect;
const DependencyOn = () => {
  return (
    <Badge className="flex items-center p-1 gap-1 ">
      A <X size={14} />
    </Badge>
  );
};
