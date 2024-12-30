import { Task } from "@/types/tasks";
import { useTheme } from "./theme-provider";

const TaskCircle = ({ radius = 40, task }: { radius?: number; task: Task }) => {
  const { theme } = useTheme();

  const STROKE = theme === "dark" ? "white" : "black";
  const bgColor = theme === "dark" ? "black" : "white";
  const criticalColor = theme === "dark" ? "#333" : "#eee";
  const fontSize = radius / 5;
  const cx = task?.x || 40;
  const cy = task?.y || 80;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={task?.critical ? "red" : STROKE}
        className={task?.critical ? "stroke-primary" : STROKE}
        strokeWidth="1"
        fill={task?.critical ? criticalColor : bgColor}
      />
      {/* <rect
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
    </>
  );
};

export default TaskCircle;
