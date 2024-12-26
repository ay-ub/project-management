import { Task } from "@/types/tasks";
import { useTheme } from "./theme-provider";

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

export default TaskCircle;
