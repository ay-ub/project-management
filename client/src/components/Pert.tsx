/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme-provider";
import useProject from "@/store/projectStore";
import calculatePert from "@/lib/PERT";
import { Task } from "@/types/tasks";

type PertData = {
  nbrOfLevels: number;
  maxLengthOfLevel: number;
  tasks: Task[];
  levels: {
    [key: number]: number[];
  };
};
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
  const [pertData, setPertData] = useState<PertData>({
    tasks: [],
    nbrOfLevels: 0,
    maxLengthOfLevel: 0,
    levels: {},
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const { currentProject } = useProject();

  useEffect(() => {
    if (currentProject) {
      const { tasks, levels } = calculatePert([
        { id: 1, duration: 5, taskName: "A", dependencies: [8, 10, 11] },
        { id: 2, duration: 4, taskName: "B", dependencies: [10, 11] },
        { id: 3, duration: 2, taskName: "C", dependencies: [] },
        { id: 4, duration: 3, taskName: "D", dependencies: [5, 8] },
        { id: 5, duration: 6, taskName: "E", dependencies: [3] },
        { id: 6, duration: 8, taskName: "F" },
        { id: 7, duration: 3, taskName: "G" },
        { id: 8, duration: 5, taskName: "H", dependencies: [3, 6, 7] },
        { id: 9, duration: 3, taskName: "I", dependencies: [1, 2, 4] },
        { id: 10, duration: 5, taskName: "J", dependencies: [3, 6] },
        { id: 11, duration: 2, taskName: "K", dependencies: [6, 7] },
        { id: 12, duration: 4, taskName: "L", dependencies: [9] },
        { id: 13, duration: 4, taskName: "M", dependencies: [9] },
      ]);
      setPertData({
        tasks,
        nbrOfLevels: Object.keys(levels).length,
        maxLengthOfLevel: Math.max(
          ...Object.values(levels).map((el) => el.length)
        ),
        levels,
      });
    }
  }, []);
  return (
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
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
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
  );
}

export default Pert;

const TaskCircle = ({
  cx = 40,
  cy = 80,
  radius = 40,
  task,
}: {
  cx: number;
  cy: number;
  radius?: number;
  task?: Task;
}) => {
  const { theme } = useTheme();

  const lineColor = theme === "dark" ? "white" : "black";
  const fontSize = radius / 5;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={lineColor}
        strokeWidth="1"
        fill="none"
      />
      <line
        x1={cx - Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
        y1={cy - radius / 3}
        x2={cx + Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
        y2={cy - radius / 3}
        stroke={lineColor}
        strokeWidth="1"
      />

      <line
        x1={cx - Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
        y1={cy + radius / 3}
        x2={cx + Math.sqrt(radius ** 2 - (radius / 3) ** 2)}
        y2={cy + radius / 3}
        stroke={lineColor}
        strokeWidth="1"
      />

      <line
        x1={cx}
        y1={cy - radius / 3}
        x2={cx}
        y2={cy + radius}
        stroke={lineColor}
        strokeWidth="1"
      />

      <text
        x={cx}
        y={cy - (radius / 2 + fontSize)}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={fontSize}
        fill={lineColor}
      >
        {task?.taskName || "Task"}
      </text>

      <text
        x={cx - radius / 2}
        y={cy}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={fontSize}
        fill={lineColor}
      >
        3
      </text>

      <text
        x={cx + radius / 2}
        y={cy}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={fontSize}
        fill={lineColor}
      >
        7
      </text>

      <text
        x={cx - radius / 2}
        y={cy + (radius / 2 + fontSize)}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={fontSize}
        fill={lineColor}
      >
        10
      </text>

      <text
        x={cx + radius / 2}
        y={cy + (radius / 2 + fontSize)}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={fontSize}
        fill={lineColor}
      >
        14
      </text>
    </>
  );
};
