/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useTheme } from "./theme-provider";
import TaskCircle from "./TaskCircle";
import TaskLink from "./TaskLink";
import usePert from "@/store/pertStore";

function Pert() {
  const { theme } = useTheme();
  const [selectedTask, setSelectedTask] = useState<number | undefined>(
    undefined
  );
  const STROKE = theme === "dark" ? "#ccc" : "#333";

  const pertData = usePert((state) => state.pertData);
  return (
    pertData && (
      <div className="w-full relative h-[calc(100vh-133px)] overflow-auto svg-container">
        <svg
          className={` w-[${pertData.width}px] h-[${pertData.height}px] absolute `}
          viewBox={`0 0 ${pertData.width} ${pertData.height}`}
          width={pertData.width + "px" || "100%"}
          height={pertData.height + "px" || "100%"}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs className="w-full h-full">
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke={STROKE}
                strokeWidth="0.1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
            className="w-full h-full"
          />
          {pertData.links?.map((link, index) => {
            const fromTask = pertData.tasks.find(
              (task) => task.id == link.from
            );
            const toTask = pertData.tasks.find((task) => task.id == link.to);
            return fromTask && toTask ? (
              <TaskLink
                key={index}
                STROKE={STROKE}
                fromTask={fromTask}
                toTask={toTask}
                radius={pertData.radius}
                selectedTask={selectedTask}
              />
            ) : null;
          })}
          {pertData.tasks?.map((task) => (
            <TaskCircle
              key={task.id}
              task={task}
              radius={pertData.radius}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
            />
          ))}
        </svg>
      </div>
    )
  );
}

export default Pert;
