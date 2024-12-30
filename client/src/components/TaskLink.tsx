import { Task } from "@/types/tasks";

function TaskLink({
  fromTask,
  toTask,
  radius,
  STROKE = "black",
}: {
  fromTask: Task;
  toTask: Task;
  radius: number;
  STROKE: string;
}) {
  return fromTask?.y == toTask?.y ? (
    <line
      x1={(fromTask?.x ?? 0) - radius}
      y1={fromTask?.y}
      x2={(toTask?.x ?? 0) + radius}
      y2={toTask?.y}
      stroke={fromTask?.critical && toTask?.critical ? "red" : STROKE}
      strokeWidth="2"
    />
  ) : (
    <path
      d={`M ${(fromTask?.x ?? 0) - radius} ${fromTask?.y} 
      C ${(fromTask?.x ?? 0) - radius - 40} ${fromTask?.y}, 
      ${(toTask?.x ?? 0) + radius + 40} ${toTask?.y}, 
      ${(toTask?.x ?? 0) + radius} ${toTask?.y}`}
      stroke={fromTask?.critical && toTask?.critical ? "red" : STROKE}
      strokeWidth="2"
      fill="none"
    />
  );
}

export default TaskLink;
