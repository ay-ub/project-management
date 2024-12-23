import { useRef, useState } from "react";
import { useTheme } from "./theme-provider";
import useProject from "@/store/projectStore";
import calculatePert from "@/lib/PERT";
function Pert() {
  const { theme } = useTheme();
  const STROKE = theme == "dark" ? "#ccc" : "#333";
  const [radius, setRadius] = useState<number>(65);
  const svgRef = useRef<SVGSVGElement>(null);
  // useEffect(() => {
  //   if (svgRef.current) {
  //     const { width, height } = svgRef.current.getBoundingClientRect();
  //     console.log(width, height);
  //   }
  // }, []);
  const { currentProject } = useProject();
  console.log(currentProject.tasks);

  const levels = calculatePert(currentProject.tasks || []);
  console.log("levels => ", levels);
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
      {Array.from({ length: 5 }).map((_, index) =>
        Array.from({ length: 4 }).map((_, i) => (
          <TaskCircle
            key={index + i}
            cx={80 + radius * 3 * index}
            cy={80 + radius * 3 * i}
            radius={radius}
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
}: {
  cx: number;
  cy: number;
  radius?: number;
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
        A
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
