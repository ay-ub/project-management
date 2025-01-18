import { Task } from "@/types/tasks";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useTheme } from "./theme-provider";
import { TaskType } from "gantt-task-react/dist/types/public-types";
import usePert from "@/store/pertStore";
function refactorTasks(tasks: Task[], theme: string) {
  const fullYear = new Date().getFullYear();
  const fullMonth = new Date().getMonth();
  return tasks.map((task) => ({
    start: new Date(fullYear, fullMonth, (task.start ?? 0) + 1),
    end: new Date(fullYear, fullMonth, (task.end ?? 0) + 1),
    name: task.taskName,
    id: `${task.id}`,
    type: "Task" as TaskType,
    progress: 0,
    dependencies: task.dependencies?.map((dep) => `${dep}`),
    styles: {
      backgroundColor:
        theme === "dark"
          ? task.critical
            ? "red"
            : "#fff"
          : task.critical
          ? "red"
          : "#000",
    },
  }));
}
const GanttContainer = () => {
  const pertData = usePert((state) => state.pertData);
  const { theme } = useTheme();
  if (!pertData.tasks) {
    return (
      <div>
        <h1>data Not Found...</h1>
      </div>
    );
  }
  const tasksWithoutStartAndEnd = pertData.tasks.filter(
    (task) => task.taskName !== "END" && task.taskName !== "START"
  );

  const tasks = refactorTasks(tasksWithoutStartAndEnd, theme);
  return (
    pertData.tasks && (
      <Gantt
        tasks={tasks}
        listCellWidth=""
        viewMode={ViewMode.Day}
        ganttHeight={490}
      />
    )
  );
};

export default GanttContainer;
