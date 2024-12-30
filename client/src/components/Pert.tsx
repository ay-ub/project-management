/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import useProject from "@/store/projectStore";
import calculatePert from "@/lib/PERT";
import TaskCircle from "./TaskCircle";
import { Task } from "@/types/tasks";
import TaskLink from "./TaskLink";
type svgConf = {
  width: number;
  height: number;
  radius: number;
};
function Pert() {
  const { theme } = useTheme();
  const STROKE = theme === "dark" ? "#ccc" : "#333";
  const [svgConf, setSvgConf] = useState<svgConf>({
    width: 0,
    height: 0,
    radius: 0,
  });

  const { currentProject, setPertData, pertData } = useProject();

  useEffect(() => {
    if (currentProject && currentProject.tasks) {
      // const pertResult = calculatePert(
      //   currentProject.tasks as Task[]
      // );
      // const pertResult = calculatePert([
      //   { id: 55, duration: 0, taskName: "START" },
      //   { id: 1, duration: 3, taskName: "P", dependencies: [4, 5] },
      //   { id: 2, duration: 5, taskName: "Q", dependencies: [6] },
      //   { id: 3, duration: 4, taskName: "R", dependencies: [55] },
      //   { id: 4, duration: 6, taskName: "S", dependencies: [3] },
      //   { id: 5, duration: 2, taskName: "T", dependencies: [3, 7] },
      //   { id: 6, duration: 7, taskName: "U", dependencies: [8] },
      //   { id: 7, duration: 3, taskName: "V", dependencies: [55] },
      //   { id: 8, duration: 4, taskName: "W", dependencies: [3, 7] },
      //   { id: 9, duration: 6, taskName: "X", dependencies: [1, 2] },
      //   { id: 10, duration: 2, taskName: "Y", dependencies: [9] },
      //   { id: 11, duration: 5, taskName: "Z", dependencies: [4, 5] },
      //   { id: 12, duration: 3, taskName: "AA", dependencies: [9] },
      //   { id: 13, duration: 4, taskName: "BB", dependencies: [10, 11] },
      //   { id: 14, duration: 0, taskName: "END", dependencies: [12, 13] },
      // ]);
      const pertResult = calculatePert([
        { id: "startId", duration: 0, taskName: "START" },
        { id: 1, duration: 5, taskName: "A", dependencies: [8, 10, 11] },
        { id: 2, duration: 4, taskName: "B", dependencies: [10, 11] },
        { id: 3, duration: 2, taskName: "C", dependencies: ["startId"] },
        { id: 4, duration: 3, taskName: "D", dependencies: [5, 8] },
        { id: 5, duration: 6, taskName: "E", dependencies: [3] },
        { id: 6, duration: 8, taskName: "F", dependencies: ["startId"] },
        { id: 7, duration: 3, taskName: "G", dependencies: ["startId"] },
        { id: 8, duration: 5, taskName: "H", dependencies: [3, 6, 7] },
        { id: 9, duration: 3, taskName: "I", dependencies: [1, 2, 4] },
        { id: 10, duration: 5, taskName: "J", dependencies: [3, 6] },
        { id: 11, duration: 2, taskName: "K", dependencies: [6, 7] },
        { id: 12, duration: 4, taskName: "L", dependencies: [9] },
        { id: 13, duration: 4, taskName: "M", dependencies: [9] },
        { id: "endId", duration: 0, taskName: "END", dependencies: [12, 13] },
      ]);
      setSvgConf({
        width: pertResult.width,
        height: pertResult.height,
        radius: 45,
      });
      setPertData({
        tasks: pertResult.tasks,
        levels: pertResult.levels,
        criticalPaths: pertResult.criticalPaths,
        projectDuration: pertResult.projectDuration,
        links: pertResult.links,
      });
    }
  }, []);
  return (
    pertData && (
      <div className="w-full relative h-[calc(100vh-133px)] overflow-auto flex items-center justify-center">
        <svg
          className={`duration-300 ease-in-out w-[${svgConf.width}px] h-[${svgConf.height}px] absolute`}
          width={svgConf.width + "px" || "100%"}
          height={svgConf.height + "px" || "100%"}
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
                radius={svgConf.radius}
              />
            ) : null;
          })}
          {pertData.tasks?.map((task) => (
            <TaskCircle key={task.id} task={task} radius={svgConf.radius} />
          ))}
        </svg>
      </div>
    )
  );
}

export default Pert;
