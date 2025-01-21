import { Task } from "@/types/tasks";
import { useTheme } from "./theme-provider";
import * as motion from "motion/react-client";
import React from "react";
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "tween", duration: 2.5, ease: "easeInOut" },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

const TaskCircle = React.memo(
  ({
    radius = 45,
    task,
    setSelectedTask,
    selectedTask,
  }: {
    radius?: number;
    task: Task;
    setSelectedTask: (
      task:
        | {
            currentTaskID: number;
            dependencies: number[];
          }
        | undefined
    ) => void;
    selectedTask:
      | {
          currentTaskID: number;
          dependencies: number[];
        }
      | undefined;
  }) => {
    const { theme } = useTheme();

    const STROKE = theme === "dark" ? "white" : "black";
    const bgColor = theme === "dark" ? "black" : "#FBF5DD";
    const criticalColor = "#f97316";
    const fontSize = radius / 5;
    const cx = task?.x || 40;
    const cy = task?.y || 80;
    const handleMouseEnter = () => {
      setSelectedTask({
        currentTaskID: task.id,
        dependencies: task.dependencies || [],
      });
    };
    const handleMouseLeave = () => {
      setSelectedTask(undefined);
    };
    return (
      <svg
        className={`${
          selectedTask != undefined
            ? !selectedTask.dependencies.includes(task.id) &&
              !task.dependencies?.includes(selectedTask.currentTaskID) &&
              selectedTask.currentTaskID != task.id &&
              "blur-sm"
            : null
        }  duration-300`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.circle
          initial="hidden"
          animate="visible"
          variants={draw}
          cx={cx}
          cy={cy}
          r={radius}
          stroke={task?.critical ? "red" : STROKE}
          className={`${
            task?.critical ? "stroke-primary " : STROKE
          } task-circle `}
          strokeWidth="2"
          fill={task?.critical ? criticalColor : bgColor}
        />
        {/*
        <motion.rect
          initial="hidden"
          animate="visible"
          variants={draw}
          x={cx - radius}
          y={cy - radius}
          width={radius * 2}
          height={radius * 2}
          className={task?.critical ? "stroke-primary" : STROKE}
          fill={task?.critical ? criticalColor : bgColor}
          stroke={STROKE}
          strokeWidth="1"
          rx={"10"}
          ry={"10"}
        /> */}
        <line
          x1={cx - Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
          y1={cy - radius / 3}
          x2={cx + Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
          y2={cy - radius / 3}
          stroke={STROKE}
          strokeWidth="1"
        />

        <line
          x1={cx - Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
          y1={cy + radius / 3}
          x2={cx + Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
          y2={cy + radius / 3}
          stroke={STROKE}
          strokeWidth="1"
        />

        <line
          x1={cx}
          y1={cy - radius / 3}
          x2={cx}
          y2={cy + radius}
          stroke={STROKE}
          strokeWidth="1"
        />

        <text
          x={cx}
          y={cy - (radius / 2 + fontSize)}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill={STROKE}
        >
          {task?.taskName}
        </text>

        <text
          x={cx - radius / 2}
          y={cy}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill={STROKE}
        >
          {task?.start}
        </text>

        <text
          x={cx + radius / 2}
          y={cy}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill={STROKE}
        >
          {task?.end}
        </text>

        <text
          x={cx - radius / 2}
          y={cy + (radius / 2 + fontSize)}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill={STROKE}
        >
          {task?.lateStart}
        </text>

        <text
          x={cx + radius / 2}
          y={cy + (radius / 2 + fontSize)}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize}
          fill={STROKE}
        >
          {task?.lateEnd}
        </text>
      </svg>
    );
  }
);

export default TaskCircle;
