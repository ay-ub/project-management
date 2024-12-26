/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme-provider";
import useProject from "@/store/projectStore";
import calculatePert from "@/lib/PERT";
import TaskCircle from "./TaskCircle";
import { Task } from "@/types/tasks";

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
    radius: 65,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const { currentProject, setPertData, pertData } = useProject();

  useEffect(() => {
    if (currentProject) {
      const { tasks, levels, criticalPaths, projectDuration } = calculatePert(
        currentProject.tasks as Task[]
      );
      // const { tasks, levels, criticalPaths, projectDuration } = calculatePert([
      //   { id: 1, duration: 5, taskName: "A", dependencies: [8, 10, 11] },
      //   { id: 2, duration: 4, taskName: "B", dependencies: [10, 11] },
      //   { id: 3, duration: 2, taskName: "C", dependencies: [] },
      //   { id: 4, duration: 3, taskName: "D", dependencies: [5, 8] },
      //   { id: 5, duration: 6, taskName: "E", dependencies: [3] },
      //   { id: 6, duration: 8, taskName: "F" },
      //   { id: 7, duration: 3, taskName: "G" },
      //   { id: 8, duration: 5, taskName: "H", dependencies: [3, 6, 7] },
      //   { id: 9, duration: 3, taskName: "I", dependencies: [1, 2, 4] },
      //   { id: 10, duration: 5, taskName: "J", dependencies: [3, 6] },
      //   { id: 11, duration: 2, taskName: "K", dependencies: [6, 7] },
      //   { id: 12, duration: 4, taskName: "L", dependencies: [9] },
      //   { id: 13, duration: 4, taskName: "M", dependencies: [9] },
      // ]);
      setPertData({
        tasks,
        nbrOfLevels: Object.keys(levels).length,
        maxLengthOfLevel: Math.max(
          ...Object.values(levels).map((el) => el.length)
        ),
        levels,
        criticalPaths,
        projectDuration,
      });
    }
  }, []);
  console.log(pertData);
  return (
    pertData && (
      <svg
        ref={svgRef}
        className="w-full h-full duration-300 ease-in-out"
        // viewBox="30 30 800 400"
        width="100%"
        height="100%"
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
          className="w-full h-[calc(100vh-133px)]"
        />

        {/* {pertData.levels &&
          Object.keys(pertData.levels).map((level) => {
            return pertData.levels[parseInt(level)].map((taskId, index) => {
              const task = pertData.tasks.find((t) => t.id === taskId);
  
              return (
                task && (
                  <TaskCircle
                    key={task.id}
                    cx={80 + svgConf.radius * 3 * index}
                    cy={80 + svgConf.radius * 3 * parseInt(level)}
                    radius={svgConf.radius}
                    task={task}
                  />
                )
              );
            });
          })} */}
        {Array.from({ length: 5 }).map((_, index) =>
          Array.from({ length: 4 }).map((_, i) => (
            <TaskCircle
              key={index + i}
              cx={80 + svgConf.radius * 3 * index}
              cy={80 + svgConf.radius * 3 * i}
              radius={svgConf.radius}
            />
          ))
        )}
      </svg>
    )
  );
}

export default Pert;
