import { Task } from "@/types/tasks";
import * as motion from "motion/react-client";
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 3.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};
function TaskLink({
  fromTask,
  toTask,
  radius,
  selectedTask,
}: {
  fromTask: Task;
  toTask: Task;
  radius: number;
  STROKE: string;
  selectedTask:
    | {
        currentTaskID: number;
        dependencies: number[];
      }
    | undefined;
}) {
  return fromTask?.y == toTask?.y ? (
    <motion.line
      initial="hidden"
      animate="visible"
      variants={draw}
      x1={(fromTask?.x ?? 0) - radius}
      y1={fromTask?.y}
      x2={(toTask?.x ?? 0) + radius}
      y2={toTask?.y}
      className={`${
        fromTask?.critical && toTask?.critical
          ? "stroke-red-400"
          : "stroke-foreground"
      } 
      ${
        selectedTask != undefined &&
        selectedTask.currentTaskID != toTask.id &&
        selectedTask.currentTaskID != fromTask.id &&
        "blur-sm"
      }
      `}
      // className={
      //   fromTask?.critical && toTask?.critical
      //     ? "stroke-primary"
      //     : "stroke-foreground"
      // }
      strokeWidth="2"
    />
  ) : (
    <motion.path
      initial="hidden"
      animate="visible"
      variants={draw}
      d={`M ${(fromTask?.x ?? 0) - radius} ${fromTask?.y} 
      C ${(fromTask?.x ?? 0) - radius - 40} ${fromTask?.y}, 
      ${(toTask?.x ?? 0) + radius + 40} ${toTask?.y}, 
      ${(toTask?.x ?? 0) + radius} ${toTask?.y}`}
      className={`${
        fromTask?.critical && toTask?.critical
          ? "stroke-red-400"
          : "stroke-foreground"
      } 
      ${
        selectedTask != undefined &&
        selectedTask.currentTaskID != toTask.id &&
        selectedTask.currentTaskID != fromTask.id &&
        "blur-sm"
      }
      `}
      // className={
      //   fromTask?.critical && toTask?.critical
      //     ? "stroke-primary"
      //     : "stroke-foreground"
      // }
      strokeWidth="2"
      fill="none"
    />
  );
}

export default TaskLink;
