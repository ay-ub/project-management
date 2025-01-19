/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import TaskCircle from "./TaskCircle";
import TaskLink from "./TaskLink";
import { PertData } from "@/types/Pert";
import useProject from "@/store/projectStore";
import calculatePert from "@/utils/PERT";

function Pert() {
  const { theme } = useTheme();
  const [selectedTask, setSelectedTask] = useState<
    | {
        currentTaskID: number;
        dependencies: number[];
      }
    | undefined
  >(undefined);
  const [pertData, setPertData] = useState<PertData>({
    tasks: [],
    levels: [],
    projectDuration: 0,
    links: [],
    width: 0,
    height: 0,
  });
  const STROKE = theme === "dark" ? "#ccc" : "#333";
  const initTasks = useProject.getState().currentProject.tasks;
  useEffect(() => {
    if (initTasks && initTasks.length > 0 && pertData.tasks.length === 0) {
      const tasks = initTasks.map((task) => {
        return {
          ...task,
        };
      });
      try {
        const result = calculatePert(tasks);
        if (!result) return;
        setPertData(result);
        console.log({
          result,
          tasks,
          initTasks,
          pertData,
        });
        useProject.setState({
          pertData: result,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [initTasks]);

  useEffect(() => {
    const pertData = useProject.getState().pertData;
    if (pertData && pertData?.tasks?.length > 0) {
      setPertData(pertData);
    }
  }, []);
  return (
    (pertData.tasks.length > 0 && (
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
                radius={50}
                selectedTask={selectedTask}
              />
            ) : null;
          })}
          {pertData.tasks?.map((task) => (
            <TaskCircle
              key={task.id}
              task={task}
              radius={50}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
            />
          ))}
        </svg>
      </div>
    )) || (
      <div className="w-full h-full flex justify-center items-center">
        No tasks
      </div>
    )
  );
}

export default Pert;
